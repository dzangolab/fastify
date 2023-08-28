import { BUCKET_SOURCE_FILE_FIELD, BUCKET_SOURCE_OPTION } from "../constants";
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
  if (bucketChoice === BUCKET_SOURCE_OPTION && optionsBucket) {
    return optionsBucket;
  }

  if (bucketChoice === BUCKET_SOURCE_FILE_FIELD && fileFieldsBucket) {
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

export { getFileExtension, getPreferredBucket };
