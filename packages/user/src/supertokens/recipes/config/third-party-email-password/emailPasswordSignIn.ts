import UserService from "../../../../model/users/service";
import formatDate from "../../../utils/formatDate";

import type {
  AuthUser,
  User,
  UserCreateInput,
  UserUpdateInput,
} from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const userService: UserService<
      User & QueryResultRow,
      UserCreateInput,
      UserUpdateInput
    > = new UserService(config, slonik);

    let user: User | null | undefined;

    try {
      user = await userService.update(originalResponse.user.id, {
        lastLoginAt: formatDate(new Date()),
      });

      if (!user) {
        throw new Error("User not found");
      }
    } catch {
      if (!user) {
        log.error(`Unable to update user ${originalResponse.user.id}`);

        throw {
          name: "SIGN_IN_FAILED",
          message: "Something went wrong",
          statusCode: 500,
        };
      }
    }

    const authUser: AuthUser = {
      ...originalResponse.user,
      ...user,
    };

    return {
      status: "OK",
      user: authUser,
    };
  };
};

export default emailPasswordSignIn;
