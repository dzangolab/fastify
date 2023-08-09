import { areRolesExist } from "@dzangolab/fastify-user";
import { deleteUser } from "supertokens-node";
import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";

import type { Tenant } from "../../../types";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log } = fastify;

  return async (input) => {
    const roles = (input.userContext.roles || []) as string[];
    const tenant: Tenant | undefined = input.userContext.tenant;

    if (tenant) {
      const tenantId = tenant[getMultiTenantConfig(config).table.columns.id];

      input.thirdPartyUserId = tenantId + "_" + input.thirdPartyUserId;
    }

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
      if (!(await areRolesExist(roles))) {
        await deleteUser(originalResponse.user.id);

        log.error(`Roles ${roles} does not exist`);

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
    }

    return originalResponse;
  };
};

export default thirdPartySignInUp;
