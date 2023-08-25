import { FileCreateInput } from "./file";

interface Multipart {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

interface FilePayload {
  fileContent: Multipart;
  metadata: FileCreateInput;
}

export type { FilePayload, Multipart };
