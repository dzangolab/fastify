import getUserService from "../../../../lib/getUserService";

import type { FastifyError, FastifyInstance } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import type { APIInterface } from "supertokens-node/recipe/session/types";

const verifySession = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): APIInterface["verifySession"] => {
  return async (input) => {
    if (originalImplementation.verifySession === undefined) {
      throw new Error("Should never come here");
    }

    input.verifySessionOptions = {
      checkDatabase: true,
      ...input.verifySessionOptions,
    };

    const originalResponse = await originalImplementation.verifySession(input);

    if (originalResponse) {
      const userId = originalResponse.getUserId();

      const request = input.userContext._default.request
        .request as SessionRequest;

      const userService = getUserService(
        request.config,
        request.slonik,
        request.dbSchema
      );

      const user = await userService.findById(userId);

      if (user?.disabled) {
        await originalResponse.revokeSession();

        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "user is disabled",
          statusCode: 401,
        } as FastifyError;
      }
    }

    return originalResponse;
  };
};

export default verifySession;
