import { UserPermissionClaim, UserRoleClaim } from "@dzangolab/fastify-user";

import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";
import getUserService from "../../../lib/getUserService";

import type { Tenant } from "../../../types/tenant";
import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const createNewSession = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): RecipeInterface["createNewSession"] => {
  return async (input) => {
    if (originalImplementation.createNewSession === undefined) {
      throw new Error("Should never come here");
    }

    const tenant = input.userContext.tenant as Tenant;

    const userService = getUserService(fastify.config, fastify.slonik, tenant);

    const user = await userService.findById(input.userId);

    if (user?.disabled) {
      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401,
      } as FastifyError;
    }

    if (tenant) {
      const request = input.userContext._default.request
        .request as FastifyRequest;

      const multiTenantConfig = getMultiTenantConfig(request.config);

      input.accessTokenPayload = {
        ...input.accessTokenPayload,
        tenantId: tenant[multiTenantConfig.table.columns.id],
      };
    }

    if (!input.userContext.roles) {
      input.userContext.roles = user?.roles.map(({ role }) => role) || [];
    }

    const userRoleBuild = await new UserRoleClaim().build(
      input.userId,
      input.userContext
    );

    const userPermissionBuild = await new UserPermissionClaim(fastify).build(
      input.userId,
      input.userContext
    );

    input.accessTokenPayload = {
      ...input.accessTokenPayload,
      ...userRoleBuild,
      ...userPermissionBuild,
    };

    const originalResponse = await originalImplementation.createNewSession(
      input
    );

    return originalResponse;
  };
};

export default createNewSession;
