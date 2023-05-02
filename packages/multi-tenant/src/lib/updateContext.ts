import { UserService } from "@dzangolab/fastify-user";
import { wrapResponse } from "supertokens-node/framework/fastify";
import Session from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

import getTenantMappedSlug from "./../config/thirdPartyEmailPassword/utils/getTenantMappedSlug";

import type {
  User,
  UserCreateInput,
  UserUpdateInput,
} from "@dzangolab/fastify-user";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";
import type { QueryResultRow } from "slonik";

const updateContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (request.config.mercurius.enabled) {
    context.tenant = request.tenant;
  }

  const session = await Session.getSession(request, wrapResponse(reply), {
    sessionRequired: false,
  });

  const userId = session?.getUserId();

  if (userId) {
    const service = context.tenant
      ? new UserService<
          User & QueryResultRow,
          UserCreateInput,
          UserUpdateInput
        >(
          context.config,
          context.database,
          context.tenant[getTenantMappedSlug(context.config)]
        )
      : new UserService<
          User & QueryResultRow,
          UserCreateInput,
          UserUpdateInput
        >(context.config, context.database);

    /* eslint-disable-next-line unicorn/no-null */
    let user;

    try {
      user = await service.findById(userId);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

    if (!user) {
      throw new Error("Unable to find user");
    }

    const { roles } = await UserRoles.getRolesForUser(userId);

    context.user = user;
    context.roles = roles;
  }
};

export default updateContext;
