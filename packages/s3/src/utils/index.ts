import { FILE_FIELD_CHOICE_BUCKET, OPTION_CHOICE_BUCKET } from "../constants";
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
  if (bucketChoice === OPTION_CHOICE_BUCKET && optionsBucket) {
    return optionsBucket;
  }

  if (bucketChoice === FILE_FIELD_CHOICE_BUCKET && fileFieldsBucket) {
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
