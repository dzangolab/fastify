import { ProfileValidationClaim } from "@dzangolab/fastify-user";

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

    const request = input.userContext._default.request
      .request as FastifyRequest;

    if (tenant) {
      const multiTenantConfig = getMultiTenantConfig(request.config);

      input.accessTokenPayload = {
        ...input.accessTokenPayload,
        tenantId: tenant[multiTenantConfig.table.columns.id],
      };
    }

    const userService = getUserService(fastify.config, fastify.slonik, tenant);

    const user = await userService.findById(input.userId);

    if (user?.disabled) {
      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.createNewSession(
      input
    );

    if (request.config.user.features?.profileValidation?.enabled) {
      await originalResponse.fetchAndSetClaim(
        new ProfileValidationClaim(request)
      );
    }

    return originalResponse;
  };
};

export default createNewSession;
