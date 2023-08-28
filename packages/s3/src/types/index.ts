import { FileCreateInput } from "./file";
import { BUCKET_SOURCE_FILE_FILED, BUCKET_SOURCE_OPTION } from "../constants";
type BucketPriority =
  | typeof BUCKET_SOURCE_OPTION
  | typeof BUCKET_SOURCE_FILE_FILED;

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
    bucketPriority?: BucketPriority;
    filename?: string;
    path?: string;
  };
}

export type { BucketPriority, FilePayload, Multipart };
