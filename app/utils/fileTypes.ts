// ✅ src/constants/fileTypes.ts
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const; 
export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];
