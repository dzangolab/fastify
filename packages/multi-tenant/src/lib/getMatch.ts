const getMatch = (url: string) => {
  let matchedDomain = "";

  const domainMatches = url.match(/^(?:https?:\/\/)?([\da-z][^\n/?]+)/i);

  if (domainMatches) {
    matchedDomain = domainMatches[1];
  }

  let matchedSlug = "";

  const slugMatches = url.match(/^(?:https?:\/\/)?(.*?)\.(?=[^/]*\..{2,5})/i);

  if (slugMatches) {
    matchedSlug = slugMatches[1];
  }

  return { matchedDomain, matchedSlug };
};

export default getMatch;
