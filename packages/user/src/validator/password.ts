import getErrorMessage from "./getErrorMessage";
import { passwordSchema } from "./schemas";

import type { FastifyInstance } from "fastify";

const validatePassword = (fastify: FastifyInstance) => {
  const strongPasswordOptions =
    fastify.config.user.supertokens.validatorOptions?.password;

  return async (password: string) => {
    const result = passwordSchema(
      {
        required: "Password is required",
        weak: getErrorMessage(strongPasswordOptions),
      },
      strongPasswordOptions
    ).safeParse(password);

    if (!result.success) {
      return result.error.issues[0].message;
    }
  };
};

export default validatePassword;
