import handlers from "./handlers";
import {
  ROUTE_INVITATIONS,
  ROUTE_INVITATIONS_ACCEPT,
  ROUTE_INVITATIONS_CREATE,
  ROUTE_INVITATIONS_GET_BY_TOKEN,
  ROUTE_INVITATIONS_RESEND,
  ROUTE_INVITATIONS_REVOKE,
} from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config.user.invitation?.handlers;

  fastify.get(
    ROUTE_INVITATIONS,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.list || handlers.listInvitation
  );

  fastify.post(
    ROUTE_INVITATIONS_CREATE,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.createInvitation
  );

  fastify.get(
    ROUTE_INVITATIONS_GET_BY_TOKEN,
    handlersConfig?.getByToken || handlers.getInvitationByToken
  );

  fastify.post(
    ROUTE_INVITATIONS_ACCEPT,
    handlersConfig?.accept || handlers.acceptInvitation
  );

  fastify.put(
    ROUTE_INVITATIONS_REVOKE,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.revoke || handlers.revokeInvitation
  );

  fastify.post(
    ROUTE_INVITATIONS_RESEND,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.resend || handlers.resendInvitation
  );

  done();
};

export default plugin;
