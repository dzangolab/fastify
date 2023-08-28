import { FileCreateInput } from "./file";
import {
  FILE_FIELD_CHOICE_BUCKET,
  FILE_STREAM,
  OPTION_CHOICE_BUCKET,
  PRE_SIGNED,
} from "../constants";
type BucketChoice =
  | typeof FILE_FIELD_CHOICE_BUCKET
  | typeof OPTION_CHOICE_BUCKET;

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
