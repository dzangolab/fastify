import { formatDate } from "@dzangolab/fastify-slonik";
import { getRequestFromUserContext } from "supertokens-node";

import getUserService from "../../../lib/getUserService";
import Email from "../../utils/email";

import type { AuthUser } from "@dzangolab/fastify-user";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const request = getRequestFromUserContext(input.userContext)?.original as
      | FastifyRequest
      | undefined;

    const tenant = input.userContext.tenant || request?.tenant;

    input.email = Email.addTenantPrefix(config, input.email, tenant);

    const originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const userService = getUserService(config, slonik, tenant);

    const user = await userService.findById(originalResponse.user.id);

    if (!user) {
      log.error(`User record not found for userId ${originalResponse.user.id}`);

      return { status: "WRONG_CREDENTIALS_ERROR" };
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

    const authUser: AuthUser = {
      ...originalResponse.user,
      ...user,
    };

    return {
      status: "OK",
      user: authUser,
    };
  };
};

export default emailPasswordSignIn;
