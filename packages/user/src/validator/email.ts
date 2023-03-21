import { FastifyInstance } from "fastify";

import { emailSchema } from "./schemas";

const validateEmail = (fastify: FastifyInstance) => {
  const { config } = fastify;

  let emailDomains: string[] | undefined = [];

  if (config.user.supertokens.supportedEmailDomains) {
    emailDomains = config.user.supertokens.supportedEmailDomains;
  }

  const hostWhiteList =
    config.user.supertokens.validatorOptions?.email?.host_whitelist;

  if (hostWhiteList) {
    emailDomains = [...emailDomains, ...hostWhiteList];
  }

  console.log(emailDomains);

  if (!emailDomains || emailDomains.filter((domain) => !!domain).length === 0) {
    emailDomains = undefined;
  }

  return async (email: string) => {
    const result = emailSchema(
      {
        invalid: "Email is invalid",
        required: "Email is required",
      },
      {
        host_whitelist: hostWhiteList,
      }
    ).safeParse(email);

    if (!result.success) {
      return result.error.issues[0].message;
    }
  };
};

export default validateEmail;
