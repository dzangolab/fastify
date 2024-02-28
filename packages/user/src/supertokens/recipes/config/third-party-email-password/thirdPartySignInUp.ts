import { deleteUser } from "supertokens-node";
import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import { TENANT_ID } from "../../../../constants";
import areRolesExist from "../../../utils/areRolesExist";

import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log } = fastify;

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

    if (originalResponse.status === "OK" && originalResponse.createdNewUser) {
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
          TENANT_ID,
          originalResponse.user.id,
          role
        );

        if (rolesResponse.status !== "OK") {
          log.error(rolesResponse.status);
        }
      }
    }

    return originalResponse;
  };
};

export default thirdPartySignInUp;
