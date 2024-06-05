import getUserService from "../../../../lib/getUserService";
import ProfileValidationClaim from "../../../utils/profileValidationClaim";

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

    const { config, dbSchema, slonik } = input.userContext._default.request
      .request as FastifyRequest;

    const userService = getUserService(config, slonik, dbSchema);

    const user = await userService.findById(input.userId);

    input.userContext._default.request.request.user = user;

    if (user?.disabled) {
      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.createNewSession(
      input
    );

    if (config.user.features?.profileValidation?.enabled) {
      await originalResponse.fetchAndSetClaim(
        new ProfileValidationClaim(input.userContext._default.request.request)
      );
    }

    return originalResponse;
  };
};

export default createNewSession;
