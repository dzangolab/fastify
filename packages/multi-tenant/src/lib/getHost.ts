const getHost = (url: string) => {
  let host: string;

  try {
    host = new URL(url).host;
  } catch {
    host = "";
  }

  return host;
};

export default getHost;
