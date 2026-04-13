const getFileExtension = (fileName: string) => {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot >= 0 ? fileName.slice(lastDot).toLowerCase() : "";
};

const matchesAcceptedType = (file: File, acceptedType: string) => {
  const normalizedAcceptedType = acceptedType.trim().toLowerCase();
  if (!normalizedAcceptedType) return false;

  if (normalizedAcceptedType.startsWith(".")) {
    return getFileExtension(file.name) === normalizedAcceptedType;
  }

  if (normalizedAcceptedType.endsWith("/*")) {
    const mimePrefix = normalizedAcceptedType.slice(0, -1);
    return file.type.toLowerCase().startsWith(mimePrefix);
  }

  return file.type.toLowerCase() === normalizedAcceptedType;
};

export const isAcceptedFileType = (file: File, acceptedTypes: string[]) =>
  acceptedTypes.some((acceptedType) => matchesAcceptedType(file, acceptedType));

export const formatAcceptedFileTypes = (acceptedTypes: string[]) =>
  acceptedTypes.join(", ");

export const validateFiles = (
  files: File[],
  {
    acceptedTypes,
    maxSizeMB,
    label = "file",
  }: {
    acceptedTypes: string[];
    maxSizeMB?: number;
    label?: string;
  },
) => {
  if (!files.length) {
    return { valid: true as const };
  }

  for (const file of files) {
    if (!isAcceptedFileType(file, acceptedTypes)) {
      return {
        valid: false as const,
        error: `Invalid file type for ${label}: ${file.name}. Allowed file types: ${formatAcceptedFileTypes(acceptedTypes)}.`,
      };
    }

    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return {
        valid: false as const,
        error: `${file.name} is too large. Maximum file size is ${maxSizeMB} MB.`,
      };
    }
  }

  return { valid: true as const };
};
