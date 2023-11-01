import UserService from "../../../../model/users/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { APIInterface } from "supertokens-node/recipe/session/types";

const refreshPost = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): APIInterface["refreshPOST"] => {
  return async (input) => {
    if (originalImplementation.refreshPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse = await originalImplementation.refreshPOST(input);

    const userId = originalResponse.getUserId();

    const userService: UserService<
      User & QueryResultRow,
      UserCreateInput,
      UserUpdateInput
    > = new UserService(fastify.config, fastify.slonik);

    const user = await userService.findById(userId);

    if (user?.blocked) {
      await originalResponse.revokeSession();
    }

    return originalResponse;
  };
};

export default refreshPost;
