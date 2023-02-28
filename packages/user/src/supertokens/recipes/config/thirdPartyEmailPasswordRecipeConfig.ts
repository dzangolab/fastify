import emailPasswordSignIn from "./third-party-email-password/emailPasswordSignIn";
import emailPasswordSignUp from "./third-party-email-password/emailPasswordSignUp";
import emailPasswordSignUpPOST from "./third-party-email-password/emailPasswordSignUpPost";
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
          emailPasswordSignUpPOST:
            config.user.features?.emailPassword === false
              ? undefined
              : emailPasswordSignUpPOST(originalImplementation, fastify),
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
