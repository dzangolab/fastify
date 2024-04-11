import { wrapResponse } from "supertokens-node/framework/fastify";
import Session from "supertokens-node/recipe/session";

import getUserService from "../lib/getUserService";

import type { User } from "@dzangolab/fastify-user";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

const updateContext = async (
  context: MercuriusContext,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { config, slonik, tenant } = request;

  context.tenant = tenant;

  const session = await Session.getSession(request, wrapResponse(reply), {
    sessionRequired: false,
  });

  const userId = session?.getUserId();

  if (userId && !context.user) {
    const service = getUserService(config, slonik, tenant);

    /* eslint-disable-next-line unicorn/no-null */
    let user: User | null = null;

    try {
      user = await service.findById(userId);
    } catch {
      // FIXME [OP 2022-AUG-22] Handle error properly
      // DataIntegrityError
    }

    if (!user) {
      throw new Error("Unable to find user");
    }

    context.user = user;
    context.roles = user.roles;
  }
};

export default updateContext;
