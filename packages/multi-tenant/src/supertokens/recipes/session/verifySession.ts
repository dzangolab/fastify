import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";
import getUserService from "../../../lib/getUserService";

import type { Tenant } from "../../../types/tenant";
import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/session/types";

const verifySession = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): APIInterface["verifySession"] => {
  return async (input) => {
    if (originalImplementation.refreshPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse = await originalImplementation.verifySession(input);

    if (originalResponse) {
      const userId = originalResponse.getUserId();

      const tenant = input.userContext.tenant as Tenant;

      console.log("verifySession input", input);
      console.log();
      // console.log(
      //   "verifySession originalResponse",
      //   originalResponse.userDataInAccessToken.tenantId
      // );

      const userService = getUserService(
        fastify.config,
        fastify.slonik,
        tenant
      );

      const user = await userService.findById(userId);

      if (user?.disabled) {
        await originalResponse.revokeSession();

        throw {
          name: "SESSION_VERIFICATION_FAILED",
          message: "user is disabled",
          statusCode: 401,
        } as FastifyError;
      }
    }

    return originalResponse;
  };
};

export default verifySession;
