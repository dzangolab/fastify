import { QueryResultRow } from "slonik";
import UserRoles from "supertokens-node/recipe/userroles";

import UserProfileService from "../../../../model/user-profiles/service";

import type {
  User,
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const thirdPartySignInUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): typeof originalImplementation.thirdPartySignInUpPOST => {
  const { log, config, slonik } = fastify;

  return async (input) => {
    if (originalImplementation.thirdPartySignInUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.thirdPartySignInUpPOST(input);

    if (originalResponse.status === "OK" && originalResponse.createdNewUser) {
      const userProfileService: UserProfileService<
        UserProfile & QueryResultRow,
        UserProfileCreateInput,
        UserProfileUpdateInput
      > = new UserProfileService(config, slonik);

      const profile = await userProfileService.create({
        id: originalResponse.user.id,
        email: originalResponse.user.email,
      });

      if (!profile) {
        throw new Error("Unable to create user profile");
      }

      const rolesResponse = await UserRoles.addRoleToUser(
        originalResponse.user.id,
        config.user.role || "USER"
      );

      if (rolesResponse.status !== "OK") {
        log.error(rolesResponse.status);
      }

      const { roles } = await UserRoles.getRolesForUser(
        originalResponse.user.id
      );

      const user: User = {
        ...originalResponse.user,
        profile,
        roles,
      };

      return {
        status: "OK",
        createdNewUser: originalResponse.createdNewUser,
        user,
        session: originalResponse.session,
        authCodeResponse: originalResponse.authCodeResponse,
      };
    }

    return originalResponse;
  };
};

export default thirdPartySignInUpPOST;
