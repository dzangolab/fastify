import type { Address } from "nodemailer/lib/mailer";

const getInterceptedAddresses = (
  recipients: string[],
  address?: string | Address | Array<string | Address>
): string | Address | Array<string | Address> | undefined => {
  return address ? recipients : undefined;
};

export default getInterceptedAddresses;
