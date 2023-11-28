import { UserService } from "@dzangolab/fastify-user";

import type {
  User,
  UserCreateInput,
  UserUpdateInput,
} from "@dzangolab/fastify-user";
import type { FastifyError, FastifyInstance } from "fastify";
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

    if (user?.disabled) {
      await originalResponse.revokeSession();

      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401,
      } as FastifyError;
    }

    return originalResponse;
  };
};

export default createNewSession;
