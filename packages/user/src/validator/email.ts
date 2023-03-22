import { emailSchema } from "./schemas";

import type { ApiConfig } from "@dzangolab/fastify-config";

const validateEmail = (email: string, config: ApiConfig) => {
  const { supportedEmailDomains, validatorOptions } = config.user.supertokens;

  let hostWhiteList: string[] | undefined = [];

  if (supportedEmailDomains) {
    hostWhiteList = supportedEmailDomains;
  }

  const whiteList = validatorOptions?.email?.host_whitelist;

  if (whiteList) {
    hostWhiteList = [...hostWhiteList, ...whiteList];
  }

  if (
    !hostWhiteList ||
    hostWhiteList.filter((domain) => !!domain).length === 0
  ) {
    hostWhiteList = undefined;
  }

  const result = emailSchema(
    {
      invalid: "Email is invalid",
      required: "Email is required",
    },
    {
      ...validatorOptions?.email,
      host_whitelist: hostWhiteList,
    }
  ).safeParse(email);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  return { success: true };
};

export default validateEmail;
