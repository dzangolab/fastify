import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Address } from "nodemailer/lib/mailer";

const interceptAddresses = (
  config: ApiConfig,
  address?: string | Address | Array<string | Address>
): string | Address | Array<string | Address> | undefined => {
  if (!address) {
    return undefined;
  }

  const recipients = config.mailer.recipients;

  if (recipients && recipients.length > 0) {
    return recipients;
  }

  return address;
};

export default interceptAddresses;
