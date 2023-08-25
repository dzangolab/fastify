import emailVerification from "./email-verification";
import { EMAIL_VERIFICATION_MODE } from "../../../constants";

import type { SendEmailWrapper, EmailVerificationRecipe } from "../../types";
import type { FastifyInstance } from "fastify";
import type {
  APIInterface,
  RecipeInterface,
  TypeInput as EmailVerificationRecipeConfig,
} from "supertokens-node/recipe/emailverification/types";

const getEmailVerificationRecipeConfig = (
  fastify: FastifyInstance
): EmailVerificationRecipeConfig => {
  const { config } = fastify;

  let emailVerification: EmailVerificationRecipe = {};

  if (typeof config.user.supertokens.recipes?.emailVerification === "object") {
    emailVerification = config.user.supertokens.recipes.emailVerification;
  }

  const mode = emailVerification?.mode || EMAIL_VERIFICATION_MODE;

  return {
    mode,
    emailDelivery: {
      override: (originalImplementation, fastify) => {
        let sendEmailConfig: SendEmailWrapper | undefined;

        if (thirdPartyEmailPassword?.sendEmail) {
          sendEmailConfig = thirdPartyEmailPassword.sendEmail;
        }

        return {
          ...originalImplementation,
          sendEmail: sendEmailConfig
            ? sendEmailConfig(originalImplementation, fastify)
            : sendPasswordResetEmail(originalImplementation, fastify),
        };
      },
    },
  };
};

export default getEmailVerificationRecipeConfig;
