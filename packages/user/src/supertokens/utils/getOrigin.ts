const getOrigin = (url: string) => {
  let origin: string;

  try {
    origin = new URL(url).origin;

    if (!origin) {
      throw new Error("Host is empty");
    }
  } catch {
    origin = "";
  }

  return origin;
};

export default getOrigin;
