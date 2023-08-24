import { FileCreateInput } from "./file";

interface MultipartBody {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

interface FilePayload {
  fileContent: MultipartBody;
  metadata?: FileCreateInput;
}

export type { FilePayload, MultipartBody };
