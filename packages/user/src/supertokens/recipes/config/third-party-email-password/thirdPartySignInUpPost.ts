import { deleteUser } from "supertokens-node";

import UserService from "../../../../model/users/service";
import formatDate from "../../../utils/formatDate";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  fastify: FastifyInstance
): APIInterface["thirdPartySignInUpPOST"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
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
          return {
            status: "GENERAL_ERROR",
            message: "Something went wrong",
          };
        }

        const lastLoginAt = Date.now();

        await userService
          .update(user.id, {
            lastLoginAt: formatDate(new Date(lastLoginAt)),
          })
          /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
          .catch((error: any) => {
            log.error(
              `Unable to update lastLoginAt for userId ${originalResponse.user.id}`
            );
            log.error(error);
          });

        user.lastLoginAt = lastLoginAt;
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
