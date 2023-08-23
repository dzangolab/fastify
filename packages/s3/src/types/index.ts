import { FileCreateInput } from "./file";

interface UploadConfigs {
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
  files: {
    uploadedFile: MultipartFile;
    fileMetadata?: FileCreateInput;
  };
  configs?: UploadConfigs;
}

export type { MultipartFile, FileUploadType };
