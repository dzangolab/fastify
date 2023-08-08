import type { FastifyInstance, FastifyError } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const defaultRole = "USER";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  fastify: FastifyInstance
): APIInterface["emailPasswordSignUpPOST"] => {
  return async (input) => {
    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    if (fastify.config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse =
      await originalImplementation.emailPasswordSignUpPOST({
        ...input,
        userContext: {
          ...input.userContext,
          role: fastify.config.user.role || defaultRole,
        },
      });

    if (originalResponse.status === "OK") {
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
