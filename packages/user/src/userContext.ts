import { wrapResponse } from "supertokens-node/framework/fastify";
import Session from "supertokens-node/recipe/session";
import SuperTokens from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import UserService from "./model/user-profiles/service";

import type { User, UserCreateInput, UserUpdateInput } from "./types";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";

const userContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { config, slonik } = request;

  const session = await Session.getSession(request, wrapResponse(reply), {
    sessionRequired: false,
  });

  const userId = session?.getUserId();

  if (userId) {
    const service: UserService<
      User & QueryResultRow,
      UserCreateInput,
      UserUpdateInput
    > = new UserService(config, slonik);

    const supertokensUser = await SuperTokens.getUserById(userId);

    if (supertokensUser) {
      /* eslint-disable-next-line unicorn/no-null */
      let profile: User | null = null;

      const { roles } = await UserRoles.getRolesForUser(userId);

      try {
        profile = await service.findById(userId);
      } catch {
        // FIXME [OP 2022-AUG-22] Handle error properly
        // DataIntegrityError
      }

      if (!profile) {
        throw new Error("Unable to find user profile");
      }

      const user = {
        ...supertokensUser,
        profile,
        roles,
      };

      context.user = user;
    }
  }
};

export default userContext;
