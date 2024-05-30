import { formatDate } from "@dzangolab/fastify-slonik";

import { ROLE_USER } from "../../../../constants";
import getUserService from "../../../../lib/getUserService";

import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["thirdPartySignInUpPOST"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    input.userContext.roles = [config.user.role || ROLE_USER];

    if (originalImplementation.thirdPartySignInUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.thirdPartySignInUpPOST(input);

    if (originalResponse.status === "OK") {
      const userService = getUserService(config, slonik);

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
