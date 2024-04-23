import { areRolesExist } from "@dzangolab/fastify-user";
import { deleteUser } from "supertokens-node";
import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";

import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";

import type { Tenant } from "../../../types";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log, slonik } = fastify;

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

    if (
      originalResponse.status === "OK" &&
      originalResponse.createdNewUser &&
      !(await areRolesExist(roles, config, slonik))
    ) {
      await deleteUser(originalResponse.user.id);

      log.error(`At least one role from ${roles.join(", ")} does not exist.`);

      throw {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500,
      } as FastifyError;
    }

    return originalResponse;
  };
};

export default thirdPartySignInUp;
