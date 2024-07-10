import { getRequestFromUserContext } from "supertokens-node";

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

    const request = getRequestFromUserContext(input.userContext)?.original as
      | FastifyRequest
      | undefined;

    if (request && !request.user) {
      const { config, dbSchema, slonik } = request;

      const userService = getUserService(config, slonik, dbSchema);

      const user = (await userService.findById(input.userId)) || undefined;

      if (user?.disabled) {
        throw {
          name: "SIGN_IN_FAILED",
          message: "user is disabled",
          statusCode: 401,
        } as FastifyError;
      }

      request.user = user;
    }

    const session = await originalImplementation.createNewSession(input);

    if (
      request?.user &&
      request?.config.user.features?.profileValidation?.enabled
    ) {
      await session.fetchAndSetClaim(
        new ProfileValidationClaim(),
        input.userContext
      );
    }

    return session;
  };
};

export default createNewSession;
