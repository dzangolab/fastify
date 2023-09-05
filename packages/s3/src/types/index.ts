import { FileCreateInput } from "./file";
import { BUCKET_FROM_FILE_FIELDS, BUCKET_FROM_OPTIONS } from "../constants";

type BucketChoice = typeof BUCKET_FROM_FILE_FIELDS | typeof BUCKET_FROM_OPTIONS;
type FileConflictStrategy = "override" | "numerical-suffix" | "error";

interface BaseOption {
  bucket?: string;
}

interface PresignedUrlOptions extends BaseOption {
  signedUrlExpiresInSecond?: number;
}

interface FilePayloadOptions extends BaseOption {
  bucketChoice?: BucketChoice;
  path?: string;
  fileConflictStrategy?: FileConflictStrategy;
}

interface FilePayload {
  file: {
    fileContent: Multipart;
    fileFields?: FileCreateInput;
  };
  options?: FilePayloadOptions;
}

interface Multipart {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

export type {
  BucketChoice,
  PresignedUrlOptions,
  FilePayload,
  FilePayloadOptions,
  Multipart,
};
