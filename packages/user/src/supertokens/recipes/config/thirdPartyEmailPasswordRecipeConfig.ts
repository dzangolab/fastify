import emailPasswordSignIn from "./third-party-email-password/emailPasswordSignIn";
import emailPasswordSignInPOST from "./third-party-email-password/emailPasswordSignInPost";
import emailPasswordSignUp from "./third-party-email-password/emailPasswordSignUp";
import emailPasswordSignUpPOST from "./third-party-email-password/emailPasswordSignUpPost";
import generatePasswordResetTokenPOST from "./third-party-email-password/generatePasswordResetTokenPost";
import getUserById from "./third-party-email-password/getUserById";
import sendEmail from "./third-party-email-password/sendEmail";
import thirdPartySignInUp from "./third-party-email-password/thirdPartySignInUp";
import thirdPartySignInUpPOST from "./third-party-email-password/thirdPartySignInUpPost";
import getThirdPartyProviders from "./thirdPartyProviders";
import validateEmail from "../../../validator/email";
import validatePassword from "../../../validator/password";

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
          emailPasswordSignInPOST: emailPasswordSignInPOST(
            originalImplementation,
            fastify
          ),
          emailPasswordSignUpPOST: emailPasswordSignUpPOST(
            originalImplementation,
            fastify
          ),
          generatePasswordResetTokenPOST: generatePasswordResetTokenPOST(
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
          getUserById: getUserById(originalImplementation),
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
