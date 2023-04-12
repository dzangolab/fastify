import emailPasswordSignIn from "./third-party-email-password/emailPasswordSignIn";
import emailPasswordSignUp from "./third-party-email-password/emailPasswordSignUp";
import emailPasswordSignUpPOST from "./third-party-email-password/emailPasswordSignUpPost";
import getFormFields from "./third-party-email-password/getFormFields";
import sendEmail from "./third-party-email-password/sendEmail";
import thirdPartySignInUp from "./third-party-email-password/thirdPartySignInUp";
import thirdPartySignInUpPOST from "./third-party-email-password/thirdPartySignInUpPost";
import getThirdPartyProviders from "./thirdPartyProviders";

import type {
  SendEmailWrapper,
  ThirdPartyEmailPasswordRecipe,
} from "../../types";
import type { FastifyInstance } from "fastify";
import type {
  APIInterface,
  RecipeInterface,
  TypeInput as ThirdPartyEmailPasswordRecipeConfig,
} from "supertokens-node/recipe/thirdpartyemailpassword/types";

const getThirdPartyEmailPasswordRecipeConfig = (
  fastify: FastifyInstance
): ThirdPartyEmailPasswordRecipeConfig => {
  const { config } = fastify;

  let thirdPartyEmailPassword: ThirdPartyEmailPasswordRecipe = {};

  if (
    typeof config.user.supertokens.recipes?.thirdPartyEmailPassword === "object"
  ) {
    thirdPartyEmailPassword =
      config.user.supertokens.recipes.thirdPartyEmailPassword;
  }

  return {
    override: {
      apis: (originalImplementation) => {
        const apiInterface: Partial<APIInterface> = {};

        if (thirdPartyEmailPassword.override?.apis) {
          const apis = thirdPartyEmailPassword.override.apis;

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
          emailPasswordSignUpPOST: emailPasswordSignUpPOST(
            originalImplementation,
            fastify
          ),
          thirdPartySignInUpPOST: thirdPartySignInUpPOST(
            originalImplementation,
            fastify
          ),
          ...apiInterface,
        };
      },
      functions: (originalImplementation) => {
        const recipeInterface: Partial<RecipeInterface> = {};

        if (thirdPartyEmailPassword.override?.functions) {
          const recipes = thirdPartyEmailPassword.override.functions;

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
          emailPasswordSignIn: emailPasswordSignIn(
            originalImplementation,
            fastify
          ),
          emailPasswordSignUp: emailPasswordSignUp(
            originalImplementation,
            fastify
          ),
          thirdPartySignInUp: thirdPartySignInUp(
            originalImplementation,
            fastify
          ),
          ...recipeInterface,
        };
      },
    },
    signUpFeature: {
      formFields: getFormFields(config),
    },
    emailDelivery: {
      override: (originalImplementation) => {
        let sendEmailConfig: SendEmailWrapper | undefined;

        if (
          typeof thirdPartyEmailPassword === "object" &&
          typeof thirdPartyEmailPassword?.sendEmail === "function"
        ) {
          sendEmailConfig = thirdPartyEmailPassword.sendEmail;
        }

        return {
          ...originalImplementation,
          sendEmail: sendEmailConfig
            ? sendEmailConfig(originalImplementation, fastify)
            : sendEmail(originalImplementation, fastify),
        };
      },
    },
    providers: getThirdPartyProviders(config),
  };
};

export default getThirdPartyEmailPasswordRecipeConfig;
