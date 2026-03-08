const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * HOW TO SET UP THE BUCKET (one-time manual step):
 *
 *   1. Supabase Dashboard → Storage → New Bucket
 *   2. Name it to match SUPABASE_BUCKET in your .env (default: "parent-files")
 *   3. Leave it PRIVATE (do NOT toggle "Public bucket")
 *   4. Click Create
 *
 * We never create the bucket programmatically — Supabase returns 405 Method
 * Not Allowed when you call createBucket() even with a service role key.
 * The bucket must exist before the server starts uploading.
 *
 * ALLOWED FILE TYPES: jpg, jpeg, png, pdf
 *
 * SIGNED URLS:
 *   Private buckets require a signed URL for every file read. We generate one
 *   immediately after upload and store it in File.file_path so reads need no
 *   extra Supabase call. Expiry is set to 10 years (effectively permanent).
 */

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"];

// 10 years in seconds
const SIGNED_URL_EXPIRES_IN = process.env.SIGNED_URL_EXPIRES_IN;

let _supabase = null;

const getClient = () => {
  if (_supabase) return _supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url)
    throw new Error(
      "Missing env var: SUPABASE_URL — add it to your .env file.",
    );
  if (!key)
    throw new Error(
      "Missing env var: SUPABASE_SERVICE_ROLE_KEY — add it to your .env file.",
    );

  _supabase = createClient(url, key, {
    auth: {
      persistSession: false, // server-side client — no session needed
      autoRefreshToken: false,
    },
  });

  return _supabase;
};

/**
 * Upload a single multer file object to an existing Supabase Storage bucket
 * and return a long-lived signed URL.
 *
 * Flow:
 *   1. Validate file type (jpg, jpeg, png, pdf only)
 *   2. Read the multer temp file from disk
 *   3. Upload to Supabase Storage
 *   4. Delete the multer temp file
 *   5. Generate a signed URL and return it — caller stores this in File.file_path
 *
 * @param {{ path: string, originalname: string, mimetype: string, size: number }} file
 * @returns {Promise<string>}
 */
const uploadFile = async (file) => {
  const supabase = getClient();
  const BUCKET = process.env.SUPABASE_BUCKET || "parent-docs";

  // Validate file type before touching Supabase
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    !ALLOWED_EXTENSIONS.includes(ext) ||
    !ALLOWED_MIME_TYPES.includes(file.mimetype)
  ) {
    try {
      fs.unlinkSync(file.path);
    } catch (_) {}
    throw new Error(
      `Invalid file type: ${file.originalname}. Only JPG, PNG, and PDF files are allowed.`,
    );
  }

  // Collision-proof storage key that preserves the original extension
  const storageKey = `${Date.now()}_${crypto.randomBytes(8).toString("hex")}${ext}`;

  const fileBuffer = fs.readFileSync(file.path);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storageKey, fileBuffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  // Always clean up the multer temp file
  try {
    fs.unlinkSync(file.path);
  } catch (_) {}

  if (uploadError) {
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storageKey, { expiresIn: SIGNED_URL_EXPIRES_IN });

  if (signedError || !signedData?.signedUrl) {
    throw new Error(
      `Supabase signed URL generation failed: ${signedError?.message ?? "no URL returned"}`,
    );
  }

  return signedData.signedUrl;
};

module.exports = { uploadFile };
