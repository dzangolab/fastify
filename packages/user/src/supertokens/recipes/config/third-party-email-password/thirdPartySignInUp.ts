import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import UserService from "../../../../model/user-profiles/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
import type { FastifyInstance, FastifyError } from "fastify";
import type { QueryResultRow } from "slonik";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const thirdPartyUser = await getUserByThirdPartyInfo(
      input.thirdPartyId,
      input.thirdPartyUserId,
      input.userContext
    );

    if (!thirdPartyUser && config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.thirdPartySignInUp(
      input
    );

    if (originalResponse.status === "OK" && originalResponse.createdNewUser) {
      const rolesResponse = await UserRoles.addRoleToUser(
        originalResponse.user.id,
        config.user.role || "USER"
      );

      if (rolesResponse.status !== "OK") {
        log.error(rolesResponse.status);
      }
    }

    const userService: UserService<
      User & QueryResultRow,
      UserCreateInput,
      UserUpdateInput
    > = new UserService(config, slonik);

    let user: User | null | undefined;

    user = await userService.findById(originalResponse.user.id);

    if (!user) {
      user = await userService.create({
        id: originalResponse.user.id,
        email: originalResponse.user.id,
      });

      if (!user) {
        log.error(`Unable to create user ${originalResponse.user.id}`);

        throw new Error(`Unable to create user ${originalResponse.user.id}`);
      }
    }

    return {
      ...originalResponse,
      user: {
        ...originalResponse.user,
        ...user,
      },
    };
  };
};

export default thirdPartySignInUp;
