import emailPasswordSignIn from "./third-party-email-password/emailPasswordSignIn";
import emailPasswordSignUp from "./third-party-email-password/emailPasswordSignUp";
import emailPasswordSignUpPOST from "./third-party-email-password/emailPasswordSignUpPost";
import sendEmail from "./third-party-email-password/sendEmail";
import thirdPartySignInUp from "./third-party-email-password/thirdPartySignInUp";
import thirdPartySignInUpPOST from "./third-party-email-password/thirdPartySignInUpPost";
import getThirdPartyProviders from "./thirdPartyProviders";
import validateEmail from "../../../validator/email";
import validatePassword from "../../../validator/password";

import type { SendEmailWrapper, SupertokensRecipes } from "../../types";
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

  const thirdPartyEmailPassword: SupertokensRecipes["thirdPartyEmailPassword"] =
    config.user.supertokens.recipes?.thirdPartyEmailPassword;

  return {
    override: {
      apis: (originalImplementation) => {
        const apiInterface: Partial<APIInterface> = {};

        if (
          typeof thirdPartyEmailPassword === "object" &&
          thirdPartyEmailPassword.override?.apis
        ) {
          const apiInterfaceConfig = thirdPartyEmailPassword.override.apis;

          let api: keyof APIInterface;

          for (api in apiInterfaceConfig) {
            const apiFunction = apiInterfaceConfig[api];

            if (apiFunction) {
              apiInterface[api] = apiFunction(
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

        if (
          typeof thirdPartyEmailPassword === "object" &&
          thirdPartyEmailPassword.override?.function
        ) {
          const recipeInterfaceConfig =
            thirdPartyEmailPassword.override.function;

          let api: keyof RecipeInterface;

          for (api in recipeInterfaceConfig) {
            const recipeFunction = recipeInterfaceConfig[api];

            if (recipeFunction) {
              recipeInterface[api] = recipeFunction(
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
      formFields: [
        {
          id: "email",
          validate: async (email) => {
            const result = validateEmail(email, config);

            if (!result.success) {
              return result.message;
            }
          },
        },
        {
          id: "password",
          validate: async (password) => {
            const result = validatePassword(password, config);

            if (!result.success) {
              return result.message;
            }
          },
        },
      ],
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
