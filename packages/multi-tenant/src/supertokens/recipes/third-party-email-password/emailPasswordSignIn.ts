import { formatDate } from "@dzangolab/fastify-slonik";

import getUserService from "../../../lib/getUserService";
import Email from "../../utils/email";

import type { AuthUser } from "@dzangolab/fastify-user";
import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    input.email = Email.addTenantPrefix(
      config,
      input.email,
      input.userContext.tenant,
    );

    const originalResponse =
      await originalImplementation.emailPasswordSignIn(input);

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const userService = getUserService(
      config,
      slonik,
      input.userContext.tenant,
    );

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
          `Unable to update lastLoginAt for userId ${originalResponse.user.id}`,
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
