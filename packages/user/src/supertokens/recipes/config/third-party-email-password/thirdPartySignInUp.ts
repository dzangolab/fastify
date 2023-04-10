import { getUserByThirdPartyInfo } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import getTenantMappedId from "../../../utils/getTenantMappedId";

import type { Tenant } from "@dzangolab/fastify-multi-tenant";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const thirdPartySignInUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["thirdPartySignInUp"] => {
  const { config, log } = fastify;

  return async (input) => {
    const tenant: Tenant | undefined = input.userContext.tenant;

    if (tenant) {
      const tenantId = tenant[getTenantMappedId(config)];

      input.thirdPartyUserId = tenantId + "_" + input.thirdPartyUserId;
    }

    const user = await getUserByThirdPartyInfo(
      input.thirdPartyId,
      input.thirdPartyUserId,
      input.userContext
    );

    if (!user && config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.thirdPartySignInUp(
      input
    );

    if (originalResponse.status === "OK") {
      const rolesResponse = await UserRoles.addRoleToUser(
        originalResponse.user.id,
        config.user.role || "USER"
      );

      if (rolesResponse.status !== "OK") {
        log.error(rolesResponse.status);
      }
    }

    return originalResponse;
  };
};

export default thirdPartySignInUp;
