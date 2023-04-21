import UserService from "../../../../model/user-profiles/service";

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
        last_login_at: Date.now(),
      });
    } catch {
      user = await userService.create({
        id: originalResponse.user.id,
        email: originalResponse.user.email,
        signed_up_at: originalResponse.user.timeJoined,
        last_login_at: originalResponse.user.timeJoined,
      });

      if (!user) {
        log.error(`Unable to create user ${originalResponse.user.id}`);

        throw new Error(`Unable to create user ${originalResponse.user.id}`);
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
