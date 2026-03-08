const prisma = require("../config/database");
const { uploadFile } = require("../utils/supabaseStorage");
const { findOrThrow } = require("../utils/findOrThrow");

/**
 * File → User relationship (from schema):
 *
 *   File.uploaded_by  (Int, FK) ──► User.user_id  (PK)
 *   User.files        (File[])  ◄── uploaded_by relation
 *
 * ParentChildFile joins File and ParentRegistration:
 *   ParentChildFile.file_id (FK) ──► File.file_id
 *   ParentChildFile.pr_id   (FK) ──► ParentRegistration.pr_id
 *
 * Required creation order (enforced in verifyRegistrationOTP):
 *   1. User must exist before File rows         (File.uploaded_by FK)
 *   2. File rows must exist before ParentChildFile (file_id FK)
 *   3. ParentRegistration must exist before ParentChildFile (pr_id FK)
 */

const parentsService = {
  /**
   * Upload multer file objects to Supabase Storage and persist File records.
   *
   * uploadFile() returns the permanent public URL, which is stored directly
   * in File.file_path — no URL generation step is needed on reads.
   *
   * Precondition: the User row for `uploaded_by` must already exist in the DB
   * because File.uploaded_by is a non-nullable FK referencing User.user_id.
   *
   * @param {Array<{originalname,path,mimetype,size}>} files  multer file objects
   * @param {number} uploaded_by  user_id of the owning user
   * @returns {Promise<Array>} created File records (file_path = public URL)
   */
  async createFiles(files, uploaded_by) {
    // Guard: gives a clear error instead of a cryptic FK violation
    await findOrThrow(
      () => prisma.user.findUnique({ where: { user_id: uploaded_by } }),
      "Uploader not found",
    );

    const created = [];

    for (const f of files) {
      // Step 1 — upload to Supabase, receive permanent public URL
      const publicUrl = await uploadFile(f);

      // Step 2 — persist File row; file_path stores the URL, not a storage key
      const file = await prisma.file.create({
        data: {
          file_name: f.originalname,
          file_path: publicUrl, // ← public URL, readable immediately on any request
          file_type: f.mimetype,
          file_size: f.size,
          uploaded_by, // ← FK → User.user_id (user must already exist)
        },
      });

      created.push(file);
    }

    return created;
  },

  async submitRegistration({ parent_id, student_ids, file_ids }) {
    const parsedStudentIds = (student_ids || []).map((id) => parseInt(id, 10));
    const parsedFileIds = (file_ids || []).map((id) => parseInt(id, 10));

    await findOrThrow(
      () => prisma.user.findUnique({ where: { user_id: parent_id } }),
      "Parent not found",
    );

    const existingRegistration = await prisma.parentRegistration.findFirst({
      where: { parent_id, status: { in: ["PENDING", "VERIFIED"] } },
    });
    if (existingRegistration) {
      throw new Error("Parent already has an active or pending registration");
    }

    const students = await prisma.student.findMany({
      where: { student_id: { in: parsedStudentIds } },
    });
    if (students.length !== parsedStudentIds.length) {
      throw new Error("One or more students not found");
    }

    if (parsedFileIds.length > 0) {
      const files = await prisma.file.findMany({
        where: { file_id: { in: parsedFileIds } },
      });
      if (files.length !== parsedFileIds.length) {
        throw new Error("One or more files not found");
      }
    }

    // ParentRegistration and ParentChildFile rows created together.
    // File rows must already exist (from createFiles) because
    // ParentChildFile.file_id is a FK referencing File.file_id.
    const registration = await prisma.parentRegistration.create({
      data: {
        parent_id,
        students: {
          create: parsedStudentIds.map((studentId) => ({
            student_id: studentId,
          })),
        },
        files:
          parsedFileIds.length > 0
            ? { create: parsedFileIds.map((fileId) => ({ file_id: fileId })) }
            : undefined,
      },
      include: {
        students: { include: { student: true } },
        files: { include: { file: true } }, // file.file_path is already a public URL
      },
    });

    return registration;
  },

  async getAllRegistrations({ page, limit, status }) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (status) where.status = status;

    const [registrations, total] = await Promise.all([
      prisma.parentRegistration.findMany({
        where,
        skip,
        take,
        include: {
          parent: {
            select: {
              user_id: true,
              fname: true,
              lname: true,
              email: true,
              contact_num: true,
            },
          },
          students: {
            include: { student: { include: { grade_level: true } } },
          },
          files: { include: { file: true } }, // file_path is already a URL
          verifier: { select: { user_id: true, fname: true, lname: true } },
        },
        orderBy: { submitted_at: "desc" },
      }),
      prisma.parentRegistration.count({ where }),
    ]);

    return {
      registrations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },

  async getRegistrationById(registrationId) {
    const registration = await prisma.parentRegistration.findUnique({
      where: { pr_id: registrationId },
      include: {
        parent: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
            email: true,
            contact_num: true,
          },
        },
        students: {
          include: { student: { include: { grade_level: true } } },
        },
        files: { include: { file: true } }, // file_path is already a URL
        verifier: { select: { user_id: true, fname: true, lname: true } },
      },
    });

    if (!registration) throw new Error("Registration not found");
    return registration;
  },

  async verifyRegistration({ pr_id, status, remarks, verified_by }) {
    const existingRegistration = await prisma.parentRegistration.findUnique({
      where: { pr_id },
    });
    if (!existingRegistration) throw new Error("Registration not found");
    if (existingRegistration.status !== "PENDING") {
      throw new Error("Registration has already been processed");
    }

    await findOrThrow(
      () => prisma.user.findUnique({ where: { user_id: verified_by } }),
      "Verifier not found",
    );

    const registration = await prisma.parentRegistration.update({
      where: { pr_id },
      data: { status, remarks, verified_by, verified_at: new Date() },
      include: {
        parent: {
          select: {
            user_id: true,
            fname: true,
            lname: true,
            email: true,
            account_status: true,
          },
        },
        students: { include: { student: true } },
      },
    });

    if (status === "VERIFIED" && registration.parent) {
      await prisma.user.update({
        where: { user_id: registration.parent.user_id },
        data: { account_status: "Active" },
      });
    }

    return registration;
  },

  async getMyChildren(parentId) {
    await findOrThrow(
      () => prisma.user.findUnique({ where: { user_id: parentId } }),
      "Parent not found",
    );

    const verifiedRegistrations = await prisma.parentRegistration.findMany({
      where: { parent_id: parentId, status: "VERIFIED" },
      include: {
        students: {
          include: { student: { include: { grade_level: true } } },
        },
      },
    });

    return verifiedRegistrations.flatMap((reg) =>
      reg.students.map((s) => s.student),
    );
  },

  async getChildGrades({ parent_id, student_id }) {
    const hasAccess = await prisma.parentRegistration.findFirst({
      where: {
        parent_id,
        status: "VERIFIED",
        students: { some: { student_id } },
      },
    });
    if (!hasAccess) throw new Error("Access denied to this student record");

    return prisma.subjectRecordStudent.findMany({
      where: { student_id },
      include: {
        subject_record: {
          include: {
            teacher: { select: { user_id: true, fname: true, lname: true } },
          },
        },
      },
    });
  },

  async getChildAttendance({ parent_id, student_id }) {
    const hasAccess = await prisma.parentRegistration.findFirst({
      where: {
        parent_id,
        status: "VERIFIED",
        students: { some: { student_id } },
      },
    });
    if (!hasAccess) throw new Error("Access denied to this student record");

    return prisma.attendanceRecord.findMany({
      where: { student_id },
      orderBy: { month: "asc" },
    });
  },
};

module.exports = parentsService;
