import { FileCreateInput } from "./file";
import { BUCKET_FROM_FILE_FIELD, BUCKET_FROM_OPTIONS } from "../constants";
type BucketChoice = typeof BUCKET_FROM_FILE_FIELD | typeof BUCKET_FROM_OPTIONS;

interface BaseOption {
  bucket?: string;
}

interface PresignedUrlOptions extends BaseOption {
  signedUrlExpiresInSecond?: number;
}

interface FilePayloadOptions extends BaseOption {
  bucketChoice?: BucketChoice;
  filename?: string;
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
