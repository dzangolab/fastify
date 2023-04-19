import UserService from "../../../../model/user-profiles/service";

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

      user = await userService.findById(originalResponse.user.id);

      if (!user) {
        user = await userService.create({
          id: originalResponse.user.id,
          email: originalResponse.user.email,
        });

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
