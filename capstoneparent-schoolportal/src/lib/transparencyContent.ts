export interface TransparencyContent {
  imageUrl: string;
  fileName?: string;
}

const STORAGE_KEY = "transparency-content";

export const DEFAULT_TRANSPARENCY_CONTENT: TransparencyContent = {
  imageUrl: "/transparency-2024-2025.png",
  fileName: "transparency-2024-2025.png",
};

function getFileNameFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] || "transparency-image";
}

function normalizeContent(
  raw: Partial<TransparencyContent> | null | undefined,
): TransparencyContent {
  const imageUrl =
    typeof raw?.imageUrl === "string" && raw.imageUrl
      ? raw.imageUrl
      : DEFAULT_TRANSPARENCY_CONTENT.imageUrl;

  return {
    imageUrl,
    fileName:
      typeof raw?.fileName === "string" && raw.fileName
        ? raw.fileName
        : getFileNameFromUrl(imageUrl),
  };
}

export function getTransparencyContent(): TransparencyContent {
  if (typeof window === "undefined") {
    return DEFAULT_TRANSPARENCY_CONTENT;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_TRANSPARENCY_CONTENT),
      );
      return DEFAULT_TRANSPARENCY_CONTENT;
    }

    const parsed = JSON.parse(raw) as Partial<TransparencyContent>;
    const normalized = normalizeContent(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_TRANSPARENCY_CONTENT),
    );
    return DEFAULT_TRANSPARENCY_CONTENT;
  }
}

export function setTransparencyContent(content: TransparencyContent): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeContent(content);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}