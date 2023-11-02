import UserService from "../../../../model/users/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
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

    const originalResponse = await originalImplementation.createNewSession(
      input
    );

    const userId = originalResponse.getUserId();

    const userService: UserService<
      User & QueryResultRow,
      UserCreateInput,
      UserUpdateInput
    > = new UserService(fastify.config, fastify.slonik);

    const user = await userService.findById(userId);

    console.log("creating new session", originalResponse);

    if (user?.disabled) {
      await originalResponse.revokeSession();
    }

    return originalResponse;
  };
};

export default createNewSession;
