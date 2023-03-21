import { emailSchema } from "./schemas";

import type { FastifyInstance } from "fastify";

const validateEmail = (fastify: FastifyInstance) => {
  const { config } = fastify;

  let hostWhiteList: string[] | undefined = [];

  if (config.user.supertokens.supportedEmailDomains) {
    hostWhiteList = config.user.supertokens.supportedEmailDomains;
  }

  const whiteList =
    config.user.supertokens.validatorOptions?.email?.host_whitelist;

  if (whiteList) {
    hostWhiteList = [...hostWhiteList, ...whiteList];
  }

  if (
    !hostWhiteList ||
    hostWhiteList.filter((domain) => !!domain).length === 0
  ) {
    hostWhiteList = undefined;
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
