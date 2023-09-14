import { ReadStream } from "node:fs";
import { Readable } from "node:stream";

import { ListObjectsOutput } from "@aws-sdk/client-s3";

import { BUCKET_FROM_FILE_FIELDS, BUCKET_FROM_OPTIONS } from "../constants";
import { BucketChoice, Multipart } from "../types";

const convertStreamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    // Process incoming data chunks
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));

    // Resolve with concatenated buffer when stream ends
    stream.once("end", () => resolve(Buffer.concat(chunks)));

    // Reject the promise if there's an error with the stream
    stream.once("error", reject);
  });
};

const getBaseName = (filename: string): string => {
  let baseName = filename.replace(/\.[^.]+$/, "");

  baseName = baseName.replace(/-\d+$/, "");

  return baseName;
};

const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");

  return lastDotIndex === -1 ? "" : filename.slice(lastDotIndex + 1);
};

const getPreferredBucket = (
  optionsBucket?: string,
  fileFieldsBucket?: string,
  bucketChoice?: BucketChoice
) => {
  if (bucketChoice === BUCKET_FROM_OPTIONS && optionsBucket) {
    return optionsBucket;
  }

  if (bucketChoice === BUCKET_FROM_FILE_FIELDS && fileFieldsBucket) {
    return fileFieldsBucket;
  }

  if (fileFieldsBucket && !optionsBucket) {
    return fileFieldsBucket;
  }

  if (optionsBucket && !fileFieldsBucket) {
    return optionsBucket;
  }

  if (fileFieldsBucket === optionsBucket) {
    return fileFieldsBucket;
  }

  return fileFieldsBucket || optionsBucket;
};

const getFilenameWithSuffix = (
  listObjects: ListObjectsOutput,
  baseFilename: string,
  fileExtension: string
): string => {
  const contents = listObjects.Contents;
  const highestSuffix = contents?.reduce((maxNumber, item) => {
    const matches = item.Key?.match(/-(\d+)\.\w+$/);

    if (matches) {
      const number = Number.parseInt(matches[1]);

      return Math.max(maxNumber, number);
    }

    return maxNumber;
  }, 0);

  const nextNumber = highestSuffix ? highestSuffix + 1 : 1;

  return `${baseFilename}-${nextNumber}.${fileExtension}`;
};

const getFileDataAsBuffer = async (
  fileData: Buffer | (() => ReadStream)
): Promise<Buffer> => {
  if (typeof fileData === "function") {
    const createReadStream = fileData as () => ReadStream;
    const readStream = createReadStream();

    return await convertStreamToBuffer(readStream);
  }

  return fileData;
};

export {
  convertStreamToBuffer,
  getBaseName,
  getFileExtension,
  getPreferredBucket,
  getFilenameWithSuffix,
  getFileDataAsBuffer,
};
