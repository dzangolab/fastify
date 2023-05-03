import { wrapResponse } from "supertokens-node/framework/fastify";
import Session from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";

import getMultiTenantConfig from "./getMultiTenantConfig";
import getUserService from "../lib/getUserService";

import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

const updateContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  context.tenant = request.tenant;

  const { config, database, tenant } = context;

  const session = await Session.getSession(request, wrapResponse(reply), {
    sessionRequired: false,
  });

  const userId = session?.getUserId();

  if (userId) {
    const service = getUserService(config, database, tenant);

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
    context.schema = tenant
      ? tenant[getMultiTenantConfig(config).table.columns.slug]
      : "";
  }
};

export default updateContext;
