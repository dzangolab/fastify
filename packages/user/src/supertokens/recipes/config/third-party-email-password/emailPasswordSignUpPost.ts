import EmailVerification from "supertokens-node/recipe/emailverification";

import { ROLE_USER } from "../../../../constants";

import type { FastifyInstance, FastifyError } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["emailPasswordSignUpPOST"] => {
  return async (input) => {
    input.userContext.roles = [fastify.config.user.role || ROLE_USER];

    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    if (fastify.config.user.features?.signUp?.enabled === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse =
      await originalImplementation.emailPasswordSignUpPOST(input);

    if (originalResponse.status === "OK") {
      // send email verification email
      if (fastify.config.user.features?.signUp?.emailVerification) {
        try {
          const tokenResponse =
            await EmailVerification.createEmailVerificationToken(
              originalResponse.user.id
            );

          if (tokenResponse.status === "OK") {
            await EmailVerification.sendEmail({
              type: "EMAIL_VERIFICATION",
              user: originalResponse.user,
              emailVerifyLink: `${fastify.config.appOrigin[0]}/auth/verify-email?token=${tokenResponse.token}&rid=emailverification`,
            });
          }
        } catch (error) {
          fastify.log.error(error);
        }
      }

      return {
        status: "OK",
        user: originalResponse.user,
        session: originalResponse.session,
      };
    }

    return originalResponse;
  };
};

export default emailPasswordSignUpPOST;
