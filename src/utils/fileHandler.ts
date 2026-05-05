// File handler utility — placeholder for future file/image upload support.
// Currently only text messages are supported.

export interface FileAttachment {
  uri: string;
  name: string;
  type: string; // MIME type
  size: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}
