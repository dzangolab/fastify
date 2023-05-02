import { formatDate } from "@dzangolab/fastify-user";

import getUserService from "../../lib/getUserService";

import type { User } from "@dzangolab/fastify-user";
import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  fastify: FastifyInstance
): APIInterface["thirdPartySignInUpPOST"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    input.userContext.tenant = input.options.req.original.tenant;

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

      let user: User | undefined;

      try {
        user = await (originalResponse.createdNewUser
          ? userService.create({
              id: originalResponse.user.id,
              email: originalResponse.user.email,
            })
          : userService.update(originalResponse.user.id, {
              lastLoginAt: formatDate(new Date()),
            }));
      } catch {
        if (!user) {
          log.error(`Unable to create user ${originalResponse.user.id}`);

          throw new Error(`Unable to create user ${originalResponse.user.id}`);
        }
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
