const getLastLoginAt = () => {
  return new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ") as unknown as number;
};

export default getLastLoginAt;
