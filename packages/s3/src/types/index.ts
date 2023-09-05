import { FileCreateInput } from "./file";
import {
  BUCKET_FROM_FILE_FIELDS,
  BUCKET_FROM_OPTIONS,
  FILE_CONFLICT_ERROR,
  FILE_CONFLICT_NUMERICAL_SUFFIX,
  FILE_CONFLICT_OVERRIDE,
} from "../constants";

type BucketChoice = typeof BUCKET_FROM_FILE_FIELDS | typeof BUCKET_FROM_OPTIONS;
type FileConflictStrategy =
  | typeof FILE_CONFLICT_OVERRIDE
  | typeof FILE_CONFLICT_NUMERICAL_SUFFIX
  | typeof FILE_CONFLICT_ERROR;

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
