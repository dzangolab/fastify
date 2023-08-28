import { BUCKET_SOURCE_FILE_FILED, BUCKET_SOURCE_OPTION } from "../constants";
import { BucketPriority } from "../types";

const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");

  return lastDotIndex === -1 ? "" : filename.slice(lastDotIndex + 1);
};

const getBucket = (
  optionsBucket: string | undefined,
  fileFieldsBucket: string | undefined,
  bucketPriority?: BucketPriority
) => {
  if (bucketPriority === BUCKET_SOURCE_OPTION && optionsBucket) {
    return optionsBucket;
  }

  if (bucketPriority === BUCKET_SOURCE_FILE_FILED && fileFieldsBucket) {
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

export { getBucket, getFileExtension };
