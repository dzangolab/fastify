import UserService from "../../../../model/users/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
import type { FastifyError, FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { APIInterface } from "supertokens-node/recipe/session/types";

const verifySession = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): APIInterface["verifySession"] => {
  return async (input) => {
    if (originalImplementation.refreshPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse = await originalImplementation.verifySession(input);

    if (originalResponse) {
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
