import emailPasswordSignIn from "./third-party-email-password/emailPasswordSignIn";
import emailPasswordSignUp from "./third-party-email-password/emailPasswordSignUp";
import emailPasswordSignUpPOST from "./third-party-email-password/emailPasswordSignUpPost";
import sendEmail from "./third-party-email-password/sendEmail";
import thirdPartySignInUp from "./third-party-email-password/thirdPartySignInUp";
import thirdPartySignInUpPOST from "./third-party-email-password/thirdPartySignInUpPost";
import getThirdPartyProviders from "./thirdPartyProviders";
import validateEmail from "../../../validations/email";
import validatePassword from "../../../validations/password";

import type { FastifyInstance } from "fastify";
import type { TypeInput as ThirdPartyEmailPasswordRecipeConfig } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const getThirdPartyEmailPasswordRecipeConfig = (
  fastify: FastifyInstance
): ThirdPartyEmailPasswordRecipeConfig => {
  const { config } = fastify;

  return {
    override: {
      apis: (originalImplementation) => {
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
        };
      },
      functions: (originalImplementation) => {
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
        };
      },
    },
    signUpFeature: {
      formFields: [
        {
          id: "email",
          validate: async (email) => {
            const isValidEmail = validateEmail(
              email,
              config.user.supertokens.supportedEmailDomains
            );

            if (!isValidEmail) {
              return "Email is invalid";
            }
          },
        },
        {
          id: "password",
          validate: async (password) => {
            const isValidPassword = validatePassword(password);

            if (!isValidPassword) {
              return "Password is weak";
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
