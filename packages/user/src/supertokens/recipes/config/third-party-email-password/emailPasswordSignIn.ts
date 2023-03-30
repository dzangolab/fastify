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
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): typeof originalImplementation.emailPasswordSignIn => {
  const { config, slonik } = fastify;

  return async (input) => {
    const originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const service: UserProfileService<
      UserProfile & QueryResultRow,
      UserProfileCreateInput,
      UserProfileUpdateInput
    > = new UserProfileService(config, slonik);

    /* eslint-disable-next-line unicorn/no-null */
    let profile: UserProfile | null = null;

    try {
      profile = await service.findById(originalResponse.user.id);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

    const { roles } = await UserRoles.getRolesForUser(originalResponse.user.id);

    const user: User = {
      ...originalResponse.user,
      ...profile,
    };

    return {
      status: "OK",
      user,
    };
  };
};

export default emailPasswordSignIn;
