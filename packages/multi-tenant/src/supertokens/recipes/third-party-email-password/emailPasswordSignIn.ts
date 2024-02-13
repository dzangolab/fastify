import { formatDate } from "@dzangolab/fastify-slonik";
import { ROLE_USER } from "@dzangolab/fastify-user";
import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_TENANT_OWNER } from "../../../constants";
import getUserService from "../../../lib/getUserService";
import Email from "../../utils/email";
import isTenantOwnerEmail from "../../utils/isTenantOwnerEmail";

import type { AuthUser, User } from "@dzangolab/fastify-user";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    if (
      input.userContext.tenant &&
      !(await isTenantOwnerEmail(
        config,
        slonik,
        input.email,
        input.userContext.tenant
      ))
    ) {
      input.email = Email.addTenantPrefix(
        config,
        input.email,
        input.userContext.tenant
      );
    }

    const originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const userService = getUserService(
      config,
      slonik,
      input.userContext.dbSchema
    );

    let user = await userService.findById(originalResponse.user.id);

    if (!user) {
      const { roles } = await UserRoles.getRolesForUser(
        originalResponse.user.id
      );

      if (input.userContext.tenant && roles.includes(ROLE_TENANT_OWNER)) {
        if (input.userContext.tenant) {
          await UserRoles.addRoleToUser(originalResponse.user.id, ROLE_USER);
        }

        user = (await userService.create({
          id: originalResponse.user.id,
          email: originalResponse.user.email,
        })) as User & QueryResultRow;
      } else {
        log.error(
          `User record not found for userId ${originalResponse.user.id}`
        );

        return { status: "WRONG_CREDENTIALS_ERROR" };
      }
    }

    user.lastLoginAt = Date.now();

    await userService
      .update(user.id, {
        lastLoginAt: formatDate(new Date(user.lastLoginAt)),
      })
      /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
      .catch((error: any) => {
        log.error(
          `Unable to update lastLoginAt for userId ${originalResponse.user.id}`
        );
        log.error(error);
      });

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
