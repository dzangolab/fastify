interface UploadOptions {
  bucket?: string;
  path?: string;
  filename?: string;
}

interface MultipartFile {
  filename: string;
  mimetype: string;
  data: Buffer;
}

interface FileUploadType {
  multipartFile: MultipartFile;
  options?: UploadOptions;
}
export type { FileUploadType };
