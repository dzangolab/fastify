import createEmailVerificationToken from "./email-verification/createEmailVerificationToken";
import sendEmailVerificationEmail from "./email-verification/sendEmailVerificationEmail";
import verifyEmailPost from "./email-verification/verifyEmailPost";
import { EMAIL_VERIFICATION_MODE } from "../../../constants";

import type {
  SendEmailWrapper,
  EmailVerificationRecipe,
} from "../../types/emailVerificationRecipe";
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
    override: {
      apis: (originalImplementation) => {
        const apiInterface: Partial<APIInterface> = {};

        if (emailVerification.override?.apis) {
          const apis = emailVerification.override.apis;

          let api: keyof APIInterface;

          for (api in apis) {
            const apiWrapper = apis[api];

            if (apiWrapper) {
              apiInterface[api] = apiWrapper(
                originalImplementation,
                fastify
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              ) as any;
            }
          }
        }

        return {
          ...originalImplementation,
          verifyEmailPOST: verifyEmailPost(originalImplementation, fastify),
          ...apiInterface,
        };
      },
      functions: (originalImplementation) => {
        const recipeInterface: Partial<RecipeInterface> = {};

        if (emailVerification.override?.functions) {
          const recipes = emailVerification.override.functions;

          let recipe: keyof RecipeInterface;

          for (recipe in recipes) {
            const recipeWrapper = recipes[recipe];

            if (recipeWrapper) {
              recipeInterface[recipe] = recipeWrapper(
                originalImplementation,
                fastify
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              ) as any;
            }
          }
        }

        return {
          ...originalImplementation,
          createEmailVerificationToken: createEmailVerificationToken(
            originalImplementation,
            fastify
          ),
          ...recipeInterface,
        };
      },
    },
  };
};

export default getEmailVerificationRecipeConfig;
