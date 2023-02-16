const getHost = (url: string) => {
  let host: string;

  try {
    host = new URL(url).host;

    // RL[2023-02-15] host will be empty for url localhost with port e.g. `localhost:3000`.
    if (!host) {
      throw new Error("Host is empty");
    }
  } catch {
    host = url;
  }

  return host;
};

export default getHost;
