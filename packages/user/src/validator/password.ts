import getErrorMessage from "./getErrorMessage";
import { passwordSchema } from "./schemas";
import { defaultOptions } from "./schemas/password";

import type { ApiConfig } from "@dzangolab/fastify-config";

const validatePassword = (password: string, config: ApiConfig) => {
  console.log("ValidatePassword", password);

  const strongPasswordOptions =
    config.user.supertokens.validatorOptions?.password;

  const result = passwordSchema(
    {
      required: "Password is required",
      weak: getErrorMessage({ ...defaultOptions, ...strongPasswordOptions }),
    },
    strongPasswordOptions
  ).safeParse(password);

  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      success: false,
    };
  }

  return { success: true };
};

export default validatePassword;
