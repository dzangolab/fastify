import { formatDate } from "@dzangolab/fastify-slonik";
import { deleteUser } from "supertokens-node";

import { ROLE_USER } from "../../../../constants";
import getRolesByNames from "../../../../lib/getRolesByNames";
import getUserService from "../../../../lib/getUserService";

import type { User } from "../../../../types";
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

      let user: User | null | undefined;

      if (originalResponse.createdNewUser) {
        try {
          user = await userService.create({
            id: originalResponse.user.id,
            email: originalResponse.user.email,
          });

          if (!user) {
            throw new Error("User not found");
          }

          const rolesResponse = await getRolesByNames(
            input.userContext.roles,
            config,
            slonik
          );

          const rolesIds = rolesResponse.map(({ id }) => id);

          await userService.addRolesToUser(originalResponse.user.id, rolesIds);

          user = (await userService.findById(originalResponse.user.id)) as User;

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
