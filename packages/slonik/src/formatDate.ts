const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 23).replace("T", " ");
};

export default formatDate;
