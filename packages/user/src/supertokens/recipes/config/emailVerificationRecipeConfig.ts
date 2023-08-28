import sendEmailVerificationEmail from "./email-verification/sendEmailVerificationEmail";
import { EMAIL_VERIFICATION_MODE } from "../../../constants";

import type {
  EmailVerificationSendEmailWrapper as SendEmailWrapper,
  EmailVerificationRecipe,
} from "../../types";
import type { FastifyInstance } from "fastify";
import type { TypeInput as EmailVerificationRecipeConfig } from "supertokens-node/recipe/emailverification/types";

const getEmailVerificationRecipeConfig = (
  fastify: FastifyInstance
): EmailVerificationRecipeConfig => {
  const { config } = fastify;

  let emailVerification: EmailVerificationRecipe = {};

  if (typeof config.user.supertokens.recipes?.emailVerification === "object") {
    emailVerification = config.user.supertokens.recipes.emailVerification;
  }

  return {
    mode: emailVerification?.mode || EMAIL_VERIFICATION_MODE,
    emailDelivery: {
      override: (originalImplementation) => {
        let sendEmailConfig: SendEmailWrapper | undefined;

        if (emailVerification?.sendEmail) {
          sendEmailConfig = emailVerification.sendEmail;
        }

        return {
          ...originalImplementation,
          sendEmail: sendEmailConfig
            ? sendEmailConfig(originalImplementation, fastify)
            : sendEmailVerificationEmail(originalImplementation, fastify),
        };
      },
    },
  };
};

export default getEmailVerificationRecipeConfig;
