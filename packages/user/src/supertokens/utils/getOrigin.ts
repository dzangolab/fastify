const getOrigin = (url: string) => {
  let origin: string;

  try {
    origin = new URL(url).origin;

    if (!origin || origin === "null") {
      console.log("Error");
      throw new Error("Origin is empty");
    }
  } catch {
    origin = "";
  }

  return origin;
};

export default getOrigin;
