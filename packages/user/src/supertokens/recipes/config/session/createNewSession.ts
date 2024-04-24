import getUserService from "../../../../lib/getUserService";
import UserPermissionClaim from "../../../utils/userPermissionClaim";
import UserRoleClaim from "../../../utils/userRoleClaim";

import type { FastifyError, FastifyInstance } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";
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
      .request as SessionRequest;

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

    if (!input.userContext.roles) {
      input.userContext.roles = user?.roles.map(({ role }) => role) || [];
    }

    const userRoleBuild = await new UserRoleClaim().build(
      input.userId,
      input.userContext
    );

    const userPermissionBuild = await new UserPermissionClaim(fastify).build(
      input.userId,
      input.userContext
    );

    input.accessTokenPayload = {
      ...input.accessTokenPayload,
      ...userRoleBuild,
      ...userPermissionBuild,
    };

    const originalResponse = await originalImplementation.createNewSession(
      input
    );

    return originalResponse;
  };
};

export default createNewSession;
