import { FileCreateInput } from "./file";

interface Multipart {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

interface FilePayload {
  file: {
    fileContent: Multipart;
    fileFields?: FileCreateInput;
  };
  options?: {
    bucket?: string;
    filename?: string;
    path?: string;
  };
}

export type { FilePayload, Multipart };
