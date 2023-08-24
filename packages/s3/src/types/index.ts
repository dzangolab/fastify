import { FileCreateInput } from "./file";

interface UploadConfig {
  bucket?: string;
  path?: string;
  filename?: string;
}

interface MultipartBody {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: false;
}

interface FilePayload {
  file: {
    fileContent: MultipartBody;
    metadata?: FileCreateInput;
  };
  config?: UploadConfig;
}

export type { FilePayload, MultipartBody };
