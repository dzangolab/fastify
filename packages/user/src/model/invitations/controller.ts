import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_INVITATIONS_CREATE = "/invitations";
  const ROUTE_INVITATIONS_GET_BY_TOKEN = "/invitations/token/:token";

  fastify.post(
    ROUTE_INVITATIONS_CREATE,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.sendInvitation
  );

  fastify.get(ROUTE_INVITATIONS_GET_BY_TOKEN, handlers.getInvitationByToken);

  done();
};

export default plugin;
