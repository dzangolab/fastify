import handlers from "./handlers";
import {
  PERMISSIONS_INVITATIONS_CREATE,
  PERMISSIONS_INVITATIONS_DELETE,
  PERMISSIONS_INVITATIONS_LIST,
  PERMISSIONS_INVITATIONS_RESEND,
  PERMISSIONS_INVITATIONS_REVOKE,
  ROUTE_INVITATIONS,
  ROUTE_INVITATIONS_ACCEPT,
  ROUTE_INVITATIONS_CREATE,
  ROUTE_INVITATIONS_DELETE,
  ROUTE_INVITATIONS_GET_BY_TOKEN,
  ROUTE_INVITATIONS_RESEND,
  ROUTE_INVITATIONS_REVOKE,
} from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.user.handlers?.invitation;

  fastify.get(
    ROUTE_INVITATIONS,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITATIONS_LIST),
      ],
    },
    handlersConfig?.list || handlers.listInvitation,
  );

  fastify.post(
    ROUTE_INVITATIONS_CREATE,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITATIONS_CREATE),
      ],
    },
    handlersConfig?.create || handlers.createInvitation,
  );

  fastify.get(
    ROUTE_INVITATIONS_GET_BY_TOKEN,
    handlersConfig?.getByToken || handlers.getInvitationByToken,
  );

  fastify.post(
    ROUTE_INVITATIONS_ACCEPT,
    handlersConfig?.accept || handlers.acceptInvitation,
  );

  fastify.put(
    ROUTE_INVITATIONS_REVOKE,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITATIONS_REVOKE),
      ],
    },
    handlersConfig?.revoke || handlers.revokeInvitation,
  );

  fastify.post(
    ROUTE_INVITATIONS_RESEND,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITATIONS_RESEND),
      ],
    },
    handlersConfig?.resend || handlers.resendInvitation,
  );

  fastify.delete(
    ROUTE_INVITATIONS_DELETE,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITATIONS_DELETE),
      ],
    },
    handlersConfig?.delete || handlers.deleteInvitation,
  );
};

export default plugin;
