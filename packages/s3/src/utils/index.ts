import { ListObjectsOutput } from "@aws-sdk/client-s3";

import { BUCKET_FROM_FILE_FIELDS, BUCKET_FROM_OPTIONS } from "../constants";
import { BucketChoice } from "../types";

const getBaseName = (filename: string): string => {
  return filename.replace(/\.[^.]+$/, "");
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
  const baseNameWithoutExtension = baseFilename.replace(/\.\w+$/, "");
  const baseNameWithSuffixRegex = new RegExp(
    `${baseNameWithoutExtension}-(\\d+)\\.${fileExtension}$`
  );

  const highestSuffix = contents?.reduce((maxNumber, item) => {
    const matches = item.Key?.match(baseNameWithSuffixRegex);

    if (matches) {
      const number = Number.parseInt(matches[1]);

      return Math.max(maxNumber, number);
    }

    return maxNumber;
  }, 0);

  const nextNumber = highestSuffix ? highestSuffix + 1 : 1;

  return `${baseNameWithoutExtension}-${nextNumber}.${fileExtension}`;
};

export {
  getBaseName,
  getFileExtension,
  getPreferredBucket,
  getFilenameWithSuffix,
};
