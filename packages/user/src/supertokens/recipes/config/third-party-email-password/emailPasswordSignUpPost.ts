import UserRoles from "supertokens-node/recipe/userroles";

import UserProfileService from "../../../../model/user-profiles/service";

import type {
  User,
  UserProfile,
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignUpPOST = (
  originalImplementation: APIInterface,
  fastify: FastifyInstance
): typeof originalImplementation.emailPasswordSignUpPOST => {
  const { log, config, slonik } = fastify;

  return async (input) => {
    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
      throw new Error("Should never come here");
    }

    const originalResponse =
      await originalImplementation.emailPasswordSignUpPOST(input);

    if (originalResponse.status === "OK") {
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
        throw new Error("Unable to create user profile.");
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
        /* eslint-disable-next-line unicorn/no-null */
        profile: profile,
        roles,
      };

      return {
        status: "OK",
        user,
        session: originalResponse.session,
      };
    }

    return originalResponse;
  };
};

export default emailPasswordSignUpPOST;
