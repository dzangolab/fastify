import { formatDate } from "@dzangolab/fastify-slonik";
import { deleteUser } from "supertokens-node";
import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import getUserService from "../../../../lib/getUserService";
import areRolesExist from "../../../utils/areRolesExist";

import type { User } from "../../../../types";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const roles = (input.userContext.roles || []) as string[];

    const thirdPartyUser = await getUserByThirdPartyInfo(
      input.thirdPartyId,
      input.thirdPartyUserId,
      input.userContext
    );

    if (!thirdPartyUser && config.user.features?.signUp?.enabled === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.thirdPartySignInUp(
      input
    );

    const userService = getUserService(
      config,
      slonik,
      input.userContext._default.request.request.dbSchema
    );

    if (originalResponse.createdNewUser) {
      if (!(await areRolesExist(roles))) {
        await deleteUser(originalResponse.user.id);

        log.error(`At least one role from ${roles.join(", ")} does not exist.`);

        throw {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500,
        } as FastifyError;
      }

      for (const role of roles) {
        const rolesResponse = await UserRoles.addRoleToUser(
          originalResponse.user.id,
          role
        );

        if (rolesResponse.status !== "OK") {
          log.error(rolesResponse.status);
        }
      }

      let user: User | null | undefined;

      try {
        user = await userService.create({
          id: originalResponse.user.id,
          email: originalResponse.user.email,
        });

        if (!user) {
          throw new Error("User not found");
        }
        /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (error: any) {
        log.error("Error while creating user");
        log.error(error);

        await deleteUser(originalResponse.user.id);

        throw {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500,
        };
      }
    } else {
      await userService
        .update(originalResponse.user.id, {
          lastLoginAt: formatDate(new Date(Date.now())),
        })
        /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
        .catch((error: any) => {
          log.error(
            `Unable to update lastLoginAt for userId ${originalResponse.user.id}`
          );
          log.error(error);
        });
    }

    return originalResponse;
  };
};

export default thirdPartySignInUp;
