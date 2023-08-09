import { formatDate } from "@dzangolab/fastify-slonik";
import { deleteUser } from "supertokens-node";

const defaultRole = "USER";

import UserService from "../../../../model/users/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): APIInterface["thirdPartySignInUpPOST"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    input.userContext.roles = [config.user.role || defaultRole];

    if (originalImplementation.thirdPartySignInUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.thirdPartySignInUpPOST(input);

    if (originalResponse.status === "OK") {
      const userService: UserService<
        User & QueryResultRow,
        UserCreateInput,
        UserUpdateInput
      > = new UserService(config, slonik);

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

          user.roles = [config.user.role || "USER"];
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
