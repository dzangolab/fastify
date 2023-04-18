import UserService from "../../../../model/user-profiles/service";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
import type { FastifyInstance } from "fastify";
import type { QueryResultRow } from "slonik";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const emailPasswordSignIn = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignIn"] => {
  const { config, slonik } = fastify;

  return async (input) => {
    const originalResponse = await originalImplementation.emailPasswordSignIn(
      input
    );

    if (originalResponse.status !== "OK") {
      return originalResponse;
    }

    const service: UserService<
      User & QueryResultRow,
      UserCreateInput,
      UserUpdateInput
    > = new UserService(config, slonik);

    /* eslint-disable-next-line unicorn/no-null */
    let profile: User | null = null;

    try {
      profile = await service.findById(originalResponse.user.id);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

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
