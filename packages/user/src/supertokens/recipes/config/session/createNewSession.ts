import getUserService from "../../../../lib/getUserService";
import profileVerificationClaim from "../../../utils/profileVerificationClaim";

import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const createNewSession = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): RecipeInterface["createNewSession"] => {
  return async (input) => {
    if (originalImplementation.createNewSession === undefined) {
      throw new Error("Should never come here");
    }

    const request = input.userContext._default.request
      .request as FastifyRequest;

    const userService = getUserService(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const user = await userService.findById(input.userId);

    if (user?.disabled) {
      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401,
      } as FastifyError;
    }

    input.userContext.user = user;

    const userProfileBuild = await new profileVerificationClaim(
      fastify,
      request
    ).build(input.userId, input.userContext);

    input.accessTokenPayload = {
      ...input.accessTokenPayload,
      ...userProfileBuild,
    };

    const originalResponse = await originalImplementation.createNewSession(
      input
    );

    return originalResponse;
  };
};

export default createNewSession;
