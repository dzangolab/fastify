import type { Address } from "nodemailer/lib/mailer";

const interceptAddresses = (
  recipients: string[],
  address?: string | Address | Array<string | Address>
): string | Address | Array<string | Address> | undefined => {
  if (!address) {
    return undefined;
  }

  return recipients;
};

export default interceptAddresses;
