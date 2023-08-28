const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");

  return lastDotIndex === -1 ? "" : filename.slice(lastDotIndex + 1);
};

const getBucket = (
  optionsBucket: string | undefined,
  fileFieldsBucket: string | undefined
) => {
  if (fileFieldsBucket && optionsBucket && fileFieldsBucket !== optionsBucket) {
    return fileFieldsBucket;
  }

  return fileFieldsBucket || optionsBucket;
};

export { getBucket, getFileExtension };
