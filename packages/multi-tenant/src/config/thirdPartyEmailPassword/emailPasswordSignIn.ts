import { UserService, formatDate } from "@dzangolab/fastify-user";

import Email from "./utils/email";
import getTenantMappedSlug from "./utils/getTenantMappedSlug";

import type {
  AuthUser,
  User,
  UserCreateInput,
  UserUpdateInput,
} from "@dzangolab/fastify-user";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    input.email = Email.addTenantPrefix(
      config,
      input.email,
      input.userContext.tenant
    );

    const originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const userService = input.userContext.tenant
      ? new UserService<
          User & QueryResultRow,
          UserCreateInput,
          UserUpdateInput
        >(config, slonik, input.userContext.tenant[getTenantMappedSlug(config)])
      : new UserService<
          User & QueryResultRow,
          UserCreateInput,
          UserUpdateInput
        >(config, slonik);

    let user: User | undefined;

    try {
      user = await userService.update(originalResponse.user.id, {
        lastLoginAt: formatDate(new Date()),
      });
    } catch {
      log.error(`Unable to update user ${originalResponse.user.id}`);

      throw new Error(`Unable to update user ${originalResponse.user.id}`);
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
