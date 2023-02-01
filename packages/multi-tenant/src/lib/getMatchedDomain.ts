const getMatchedDomain = (url: string) => {
  let matchedDomain = "";

  const domainMatches = url.match(/^(?:https?:\/\/)?([\da-z][^\n/?]+)/i);

  if (domainMatches) {
    matchedDomain = domainMatches[1];
  }

  return matchedDomain;
};

export default getMatchedDomain;
