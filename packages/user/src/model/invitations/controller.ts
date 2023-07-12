import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_INVITATIONS = "/invitations";
  const ROUTE_GET_INVITATION_BY_TOKEN = "/get-invitation-by-token";
  const ROUTE_SIGNUP_INVITATION = "/invitations/signup";
  const ROUTE_REVOKE_INVITATION = "/invitations/revoke/:id(^\\d+)";
  const ROUTE_INVITATIONS_RESEND = "/invitations/resend/:id(^\\d+)";

  fastify.post(
    ROUTE_INVITATIONS,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.sendInvitation
  );

  fastify.get(ROUTE_GET_INVITATION_BY_TOKEN, handlers.getInvitationByToken);

  fastify.post(ROUTE_SIGNUP_INVITATION, handlers.signupInvitation);

  fastify.put(
    ROUTE_REVOKE_INVITATION,
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
