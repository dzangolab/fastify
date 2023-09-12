import { FileCreateInput } from "./file";
import {
  ADD_SUFFIX,
  BUCKET_FROM_FILE_FIELDS,
  BUCKET_FROM_OPTIONS,
  ERROR,
  OVERRIDE,
} from "../constants";

type BucketChoice = typeof BUCKET_FROM_FILE_FIELDS | typeof BUCKET_FROM_OPTIONS;
type FilenameResolutionStrategy =
  | typeof ADD_SUFFIX
  | typeof ERROR
  | typeof OVERRIDE;

interface BaseOption {
  bucket?: string;
}

interface PresignedUrlOptions extends BaseOption {
  signedUrlExpiresInSecond?: number;
}

interface FilePayloadOptions extends BaseOption {
  bucketChoice?: BucketChoice;
  filenameResolutionStrategy?: FilenameResolutionStrategy;
  path?: string;
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
