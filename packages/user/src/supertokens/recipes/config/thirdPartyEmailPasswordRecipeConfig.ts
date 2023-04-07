import emailPasswordSignIn from "./third-party-email-password/emailPasswordSignIn";
import emailPasswordSignUp from "./third-party-email-password/emailPasswordSignUp";
import emailPasswordSignUpPOST from "./third-party-email-password/emailPasswordSignUpPost";
import sendEmail from "./third-party-email-password/sendEmail";
import thirdPartySignInUp from "./third-party-email-password/thirdPartySignInUp";
import thirdPartySignInUpPOST from "./third-party-email-password/thirdPartySignInUpPost";
import getThirdPartyProviders from "./thirdPartyProviders";
import validateEmail from "../../../validator/email";
import validatePassword from "../../../validator/password";

import type {
  APIInterfaceWrapper,
  RecipeInterfaceWrapper,
  SupertokensRecipes,
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

  return {
    override: {
      apis: (originalImplementation) => {
        const thirdPartyEmailPassword: SupertokensRecipes["thirdPartyEmailPassword"] =
          config.user.supertokens.recipes?.thirdPartyEmailPassword;

        let apiInterfaceConfig: APIInterfaceWrapper | undefined;

        if (typeof thirdPartyEmailPassword === "object") {
          apiInterfaceConfig = thirdPartyEmailPassword?.override?.apis;
        }

        const apiInterface: Partial<APIInterface> = {};

        if (apiInterfaceConfig) {
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
        const thirdPartyEmailPassword: SupertokensRecipes["thirdPartyEmailPassword"] =
          config.user.supertokens.recipes?.thirdPartyEmailPassword;

        let recipeInterfaceConfig: RecipeInterfaceWrapper | undefined;

        if (typeof thirdPartyEmailPassword === "object") {
          recipeInterfaceConfig = thirdPartyEmailPassword?.override?.function;
        }

        const recipeInterface: Partial<RecipeInterface> = {};

        if (recipeInterfaceConfig) {
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
        return {
          ...originalImplementation,
          sendEmail: sendEmail(fastify),
        };
      },
    },
    providers: getThirdPartyProviders(config),
  };
};

export default getThirdPartyEmailPasswordRecipeConfig;
