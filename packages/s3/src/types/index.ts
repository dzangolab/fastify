interface File {
  id: number;
  originalFileName: string;
  bucket: string;
  description?: string;
  key: string;
  uploadedById?: string;
  uploadedAt?: number;
  downloadCount?: number;
  lastDownloadedAt?: number;
  createdAt: number;
  updatedAt: number;
}

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

type FileCreateInput = Omit<File, "id" | "createdAt" | "updatedAt">;

type FileUpdateInput = Partial<Omit<File, "id" | "createdAt" | "updatedAt">>;

export type { File, FileCreateInput, FileUpdateInput, FileUploadType };
