import { ROLE_USER } from "@dzangolab/fastify-user";

import { ROLE_TENANT_OWNER } from "../../../constants";
import getHost from "../../../lib/getHost";
import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";
import getUserService from "../../../lib/getUserService";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["thirdPartySignInUpPOST"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const request = input.options.req.original as FastifyRequest;

    const url =
      request.headers.referer || request.headers.origin || request.hostname;

    const host = getHost(url);

    const { admin, www } = getMultiTenantConfig(request.config).reserved;

    input.userContext.roles =
      www.enabled &&
      (www.slugs.some(
        (slug) => `${slug}.${request.config.multiTenant.rootDomain}` === host
      ) ||
        www.domains.includes(host))
        ? [ROLE_TENANT_OWNER]
        : [request.config.user.role || ROLE_USER];

    // if request from admin app, throw error
    if (
      admin.enabled &&
      (admin.slugs.some(
        (slug) => `${slug}.${request.config.multiTenant.rootDomain}` === host
      ) ||
        admin.domains.includes(host))
    ) {
      throw {
        name: "SIGN_UP_FAILED",
        message: "Admin signUp is not allowed",
        statusCode: 403,
      };
    }

    input.userContext.tenant = request.tenant;

    if (originalImplementation.thirdPartySignInUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.thirdPartySignInUpPOST(input);

    if (originalResponse.status === "OK") {
      const userService = getUserService(config, slonik, request.tenant);

      const user = await userService.findById(originalResponse.user.id);

      if (!user) {
        log.error(
          `User record not found for userId ${originalResponse.user.id}`
        );

        return {
          status: "GENERAL_ERROR",
          message: "Something went wrong",
        };
      }

      return {
        ...originalResponse,
        user: {
          ...originalResponse.user,
          ...user,
        },
      };
    }

    return originalResponse;
  };
};

export default thirdPartySignInUpPOST;
