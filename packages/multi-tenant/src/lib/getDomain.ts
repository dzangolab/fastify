const getDomain = (url: string) => {
  let matchedDomain = "";

  const domainMatches = url.match(/^(?:https?:\/\/)?([\da-z][^\n/?]+)/i);

  if (domainMatches) {
    matchedDomain = domainMatches[1];
  }

  if (!matchedDomain.includes(".")) {
    return "";
  }

  return matchedDomain;
};

export default getDomain;
