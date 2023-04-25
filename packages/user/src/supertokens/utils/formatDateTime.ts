const formatDateTime = (date: Date) => {
  return date.toISOString().slice(0, 19).replace("T", " ") as unknown as number;
};

export default formatDateTime;
