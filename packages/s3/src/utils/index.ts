import { BUCKET_FROM_FILE_FIELDS, BUCKET_FROM_OPTIONS } from "../constants";
import { BucketChoice } from "../types";

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

const getFilenameWithSuffix = (originalFilename: string): string => {
  const match = originalFilename.match(/(.*?)(-\d+)?(\.\w+)$/);

  if (!match) {
    return originalFilename;
  }

  const [, base, suffix = "", extension] = match;
  const nextSuffix = suffix ? `-${Number.parseInt(suffix.slice(1)) + 1}` : "-1";

  return `${base}${nextSuffix}${extension}`;
};

export { getFileExtension, getPreferredBucket, getFilenameWithSuffix };
