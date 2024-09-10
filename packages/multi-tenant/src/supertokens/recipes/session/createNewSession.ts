import { ProfileValidationClaim } from "@dzangolab/fastify-user";
import { getRequestFromUserContext } from "supertokens-node";

import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";
import getUserService from "../../../lib/getUserService";

import type { Tenant } from "../../../types/tenant";
import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const createNewSession = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance,
): RecipeInterface["createNewSession"] => {
  return async (input) => {
    if (originalImplementation.createNewSession === undefined) {
      throw new Error("Should never come here");
    }

    const request = getRequestFromUserContext(input.userContext)?.original as
      | FastifyRequest
      | undefined;

    const tenant = input.userContext.tenant as Tenant;

    if (request) {
      const { config, slonik } = request;

      const multiTenantConfig = getMultiTenantConfig(config);

      if (tenant) {
        input.accessTokenPayload = {
          ...input.accessTokenPayload,
          tenantId: tenant[multiTenantConfig.table.columns.id],
        };
      }

      const userService = getUserService(config, slonik, tenant);

      const user = (await userService.findById(input.userId)) || undefined;

      if (user?.disabled) {
        throw {
          name: "SIGN_IN_FAILED",
          message: "user is disabled",
          statusCode: 401,
        } as FastifyError;
      }

      input.userContext._default.request.request.user = user;
    }

    const session = await originalImplementation.createNewSession(input);

    if (request && request.config.user.features?.profileValidation?.enabled) {
      await session.fetchAndSetClaim(
        new ProfileValidationClaim(),
        input.userContext,
      );
    }

    return session;
  };
};

export default createNewSession;
