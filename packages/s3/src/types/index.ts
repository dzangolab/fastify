import { FileCreateInput } from "./file";
import {
  BUCKET_SOURCE_FILE_FIELD,
  BUCKET_SOURCE_OPTION,
  FILE_STREAM,
  PRE_SIGNED,
} from "../constants";
type BucketChoice =
  | typeof BUCKET_SOURCE_OPTION
  | typeof BUCKET_SOURCE_FILE_FIELD;

interface BaseOption {
  bucket?: string;
}

interface DownloadPayloadOption extends BaseOption {
  signedUrlExpiresInSecond?: number;
  sourceType: typeof FILE_STREAM | typeof PRE_SIGNED;
}

interface FilePayloadOption extends BaseOption {
  bucketChoice?: BucketChoice;
  filename?: string;
  path?: string;
}

interface FilePayload {
  file: {
    fileContent: Multipart;
    fileFields?: FileCreateInput;
  };
  options?: FilePayloadOption;
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
  DownloadPayloadOption,
  FilePayload,
  FilePayloadOption,
  Multipart,
};
