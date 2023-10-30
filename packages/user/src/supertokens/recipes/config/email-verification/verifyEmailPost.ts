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

    // Check if the user is logged in
    const { session } = input;

    if (session === undefined) {
      throw {
        name: "UNAUTHORIZED",
        message: "unauthorised",
        statusCode: 401,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.verifyEmailPOST(
      input
    );

    if (originalResponse.status === "OK") {
      return {
        status: "OK",
        user: originalResponse.user,
      };
    }

    return originalResponse;
  };
};

export default verifyEmailPost;
