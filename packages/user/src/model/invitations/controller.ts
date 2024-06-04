import handlers from "./handlers";
import {
  PERMISSIONS_INVITIATIONS_CREATE,
  PERMISSIONS_INVITIATIONS_DELETE,
  PERMISSIONS_INVITIATIONS_LIST,
  PERMISSIONS_INVITIATIONS_RESEND,
  PERMISSIONS_INVITIATIONS_REVOKE,
  ROUTE_INVITATIONS,
  ROUTE_INVITATIONS_ACCEPT,
  ROUTE_INVITATIONS_CREATE,
  ROUTE_INVITATIONS_DELETE,
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
  const handlersConfig = fastify.config.user.handlers?.invitation;

  fastify.get(
    ROUTE_INVITATIONS,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITIATIONS_LIST),
      ],
    },
    handlersConfig?.list || handlers.listInvitation
  );

  fastify.post(
    ROUTE_INVITATIONS_CREATE,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITIATIONS_CREATE),
      ],
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
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITIATIONS_REVOKE),
      ],
    },
    handlersConfig?.revoke || handlers.revokeInvitation
  );

  fastify.post(
    ROUTE_INVITATIONS_RESEND,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITIATIONS_RESEND),
      ],
    },
    handlersConfig?.resend || handlers.resendInvitation
  );

  fastify.post(
    ROUTE_INVITATIONS_DELETE,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_INVITIATIONS_DELETE),
      ],
    },
    handlersConfig?.delete || handlers.deleteInvitation
  );

  done();
};

export default plugin;
