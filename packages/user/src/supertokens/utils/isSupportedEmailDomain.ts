const isSupportedEmailDomain = (
  email: string,
  supportedEmailDomains: string[]
) => {
  const emailDomain = email.split("@")?.[1];

  if (!emailDomain) {
    return false;
  }

  if (supportedEmailDomains.includes(emailDomain)) {
    return true;
  }

  return false;
};

export default isSupportedEmailDomain;
