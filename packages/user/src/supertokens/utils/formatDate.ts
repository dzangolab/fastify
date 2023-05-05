const formatDate = (date: Date) => {
  return date.toISOString().slice(0, 23).replace("T", " ") as unknown as number;
};

export default formatDate;
