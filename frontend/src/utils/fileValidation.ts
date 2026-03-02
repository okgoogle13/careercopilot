/**
 * Client-side file validation using the File API.
 *
 * Validates file size and MIME type before any API call to provide fast,
 * clear feedback without wasting network bandwidth on invalid uploads.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Known MIME types for each accepted extension. */
const EXTENSION_TO_MIME: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.doc': ['application/msword'],
  '.txt': ['text/plain'],
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate a single File object using the browser File API.
 *
 * Checks (in order):
 * 1. File is not empty
 * 2. File size does not exceed maxSizeBytes
 * 3. File extension is in allowedExtensions
 * 4. MIME type (file.type) matches the expected type for that extension,
 *    when the browser provides a non-empty MIME string.
 */
export function validateFile(
  file: File,
  allowedExtensions: string[] = ['.pdf', '.docx', '.txt'],
  maxSizeBytes: number = MAX_FILE_SIZE_BYTES,
): FileValidationResult {
  if (file.size === 0) {
    return { valid: false, error: `"${file.name}" is empty.` };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = maxSizeBytes / (1024 * 1024);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `"${file.name}" is ${fileMB} MB — maximum allowed is ${maxMB} MB.`,
    };
  }

  const dotIndex = file.name.lastIndexOf('.');
  const ext = dotIndex !== -1 ? file.name.slice(dotIndex).toLowerCase() : '';
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `"${file.name}" has an unsupported file type. Accepted: ${allowedExtensions.join(', ')}.`,
    };
  }

  // MIME check via File API — browser may leave this empty for some file types
  if (file.type !== '') {
    const allowedMimes = allowedExtensions.flatMap((e) => EXTENSION_TO_MIME[e] ?? []);
    if (!allowedMimes.includes(file.type)) {
      return {
        valid: false,
        error: `"${file.name}" does not appear to be a valid ${ext} file.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate an array of File objects. Returns on the first failure.
 */
export function validateFiles(
  files: File[],
  allowedExtensions: string[] = ['.pdf', '.docx', '.txt'],
  maxSizeBytes: number = MAX_FILE_SIZE_BYTES,
): FileValidationResult {
  for (const file of files) {
    const result = validateFile(file, allowedExtensions, maxSizeBytes);
    if (!result.valid) return result;
  }
  return { valid: true };
}
