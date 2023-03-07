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
import isSupportedEmailDomain from "../../utils/isSupportedEmailDomain";

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
          emailPasswordSignInPOST: emailPasswordSignInPOST(
            originalImplementation,
            fastify
          ),
          thirdPartySignInUpPOST: thirdPartySignInUpPOST(
            originalImplementation,
            fastify
          ),
          generatePasswordResetTokenPOST: generatePasswordResetTokenPOST(
            originalImplementation
          ),
        };
      },
      functions: (originalImplementation) => {
        return {
          ...originalImplementation,
          emailPasswordSignIn: emailPasswordSignIn(originalImplementation),
          emailPasswordSignUp: emailPasswordSignUp(
            originalImplementation,
            fastify
          ),
          thirdPartySignInUp: thirdPartySignInUp(
            originalImplementation,
            fastify
          ),
          getUserById: getUserById(originalImplementation),
        };
      },
    },
    signUpFeature: {
      formFields: [
        {
          id: "email",
          validate: async (email) => {
            const emailRegex = /^([\w+.]+)(\w)(@)(\w+)(\.\w+)+$/;
            const emailDomains = config.user.supertokens.supportedEmailDomains;

            if (!emailRegex.test(email)) {
              return "Email is invalid";
            }

            if (!emailDomains) {
              return;
            }

            if (emailDomains.filter((domain) => !!domain).length === 0) {
              return;
            }

            if (
              !isSupportedEmailDomain(
                email,
                config.user.supertokens.supportedEmailDomains as string[]
              )
            ) {
              return "Unsupported Email Domain";
            }

            return;
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
