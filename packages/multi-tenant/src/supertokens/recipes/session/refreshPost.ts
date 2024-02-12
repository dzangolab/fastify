import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";

import type { FastifyError, FastifyInstance, FastifyRequest } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/session/types";

const refreshPost = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): APIInterface["refreshPOST"] => {
  return async (input) => {
    if (originalImplementation.refreshPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse = await originalImplementation.refreshPOST(input);

    if (originalResponse) {
      const request = input.userContext._default.request
        .request as FastifyRequest;

      const tenantId = originalResponse.getAccessTokenPayload().tenantId;

      if (request.tenant) {
        const multiTenantConfig = getMultiTenantConfig(request.config);

        if (tenantId != request.tenant[multiTenantConfig.table.columns.id]) {
          throw {
            name: "SESSION_VERIFICATION_FAILED",
            message: "invalid session",
            statusCode: 401,
          } as FastifyError;
        }
      }
    }

    return originalResponse;
  };
};

export default refreshPost;
