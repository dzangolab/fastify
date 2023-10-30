import type { FastifyInstance, FastifyError } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/emailverification/types";

const verifyEmailPost = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["verifyEmailPOST"] => {
  return async (input) => {
    if (originalImplementation.verifyEmailPOST === undefined) {
      throw new Error("Should never come here");
    }

    const session = input.session;

    if (!session) {
      return {
        status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR",
      };
    }

    // TODO: if token is not valid for current user, return {status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR"}

    const response = await originalImplementation.verifyEmailPOST(input);

    return response;
  };
};

export default verifyEmailPost;
