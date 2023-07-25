import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_INVITATIONS = "/invitations";
  const ROUTE_INVITATIONS_ACCEPT = "/invitations/token/:token";
  const ROUTE_INVITATIONS_CREATE = "/invitations";
  const ROUTE_INVITATIONS_GET_BY_TOKEN = "/invitations/token/:token";
  const ROUTE_INVITATIONS_RESEND = "/invitations/resend/:id(^\\d+)";
  const ROUTE_INVITATIONS_REVOKE = "/invitations/revoke/:id(^\\d+)";

  fastify.get(
    ROUTE_INVITATIONS,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.listInvitation
  );

  fastify.post(
    ROUTE_INVITATIONS_CREATE,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.createInvitation
  );

  fastify.get(ROUTE_INVITATIONS_GET_BY_TOKEN, handlers.getInvitationByToken);

  fastify.post(ROUTE_INVITATIONS_ACCEPT, handlers.acceptInvitation);

  fastify.put(
    ROUTE_INVITATIONS_REVOKE,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.revokeInvitation
  );

  fastify.post(
    ROUTE_INVITATIONS_RESEND,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.resendInvitation
  );

  done();
};

export default plugin;
