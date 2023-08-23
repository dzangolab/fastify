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
  file: {
    multipartFile: MultipartFile;
    description?: string;
    uploadedById?: string;
  };
  options?: UploadOptions;
}
export type { FileUploadType };
