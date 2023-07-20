const validateUuid = (uuid: string): boolean => {
  const regexp = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;

  return regexp.test(uuid);
};

export default validateUuid;
