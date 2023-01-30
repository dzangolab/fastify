import type { IncomingHttpHeaders } from "node:http";

const getMatch = (hostname: string, headers?: IncomingHttpHeaders) => {
  const url = headers?.referer || headers?.origin || hostname;

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
