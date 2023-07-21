import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_INVITATIONS_ACCEPT = "/invitations/token/:token";
  const ROUTE_INVITATIONS_CREATE = "/invitations";
  const ROUTE_INVITATIONS_GET_BY_TOKEN = "/invitations/token/:token";

  fastify.post(
    ROUTE_INVITATIONS_CREATE,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.createInvitation
  );

  fastify.get(ROUTE_INVITATIONS_GET_BY_TOKEN, handlers.getInvitationByToken);

  fastify.post(ROUTE_INVITATIONS_ACCEPT, handlers.acceptInvitation);

  done();
};

export default plugin;
