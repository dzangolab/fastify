import { formatDate } from "@dzangolab/fastify-slonik";
import { ROLE_USER } from "@dzangolab/fastify-user";
import { deleteUser } from "supertokens-node";

import { ROLE_TENANT_OWNER } from "../../../constants";
import getHost from "../../../lib/getHost";
import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";
import getUserService from "../../../lib/getUserService";

import type { User } from "@dzangolab/fastify-user";
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
      www.slugs.some(
        (slug) => `${slug}.${request.config.multiTenant.rootDomain}` === host
      )
        ? [ROLE_TENANT_OWNER]
        : [request.config.user.role || ROLE_USER];

    // if request for admin app, throw error
    if (
      admin.enabled &&
      admin.slugs.some(
        (slug) => `${slug}.${request.config.multiTenant.rootDomain}` === host
      )
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
      const userService = getUserService(
        config,
        slonik,
        input.userContext.tenant
      );

      let user: User | undefined | null;

      if (originalResponse.createdNewUser) {
        try {
          user = await userService.create({
            id: originalResponse.user.id,
            email: originalResponse.user.email,
          });

          if (!user) {
            throw new Error("User not found");
          }

          user.roles = input.userContext.roles;
          /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } catch (error: any) {
          log.error("Error while creating user");
          log.error(error);

          await deleteUser(originalResponse.user.id);

          throw {
            name: "SIGN_UP_FAILED",
            message: "Something went wrong",
            statusCode: 500,
          };
        }
      } else {
        user = await userService.findById(originalResponse.user.id);

        if (!user) {
          log.error(
            `User record not found for userId ${originalResponse.user.id}`
          );

          return {
            status: "GENERAL_ERROR",
            message: "Something went wrong",
          };
        }

        user.lastLoginAt = Date.now();

        await userService
          .update(user.id, {
            lastLoginAt: formatDate(new Date(user.lastLoginAt)),
          })
          /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .catch((error: any) => {
            log.error(
              `Unable to update lastLoginAt for userId ${originalResponse.user.id}`
            );
            log.error(error);
          });
      }
      return {
        status: "OK",
        createdNewUser: originalResponse.createdNewUser,
        user: {
          ...originalResponse.user,
          ...user,
        },
        session: originalResponse.session,
        authCodeResponse: originalResponse.authCodeResponse,
      };
    }

    return originalResponse;
  };
};

export default thirdPartySignInUpPOST;
