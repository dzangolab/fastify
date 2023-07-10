import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_INVITATION = "/invitations";
  const ROUTE_GET_INVITATION_BY_TOKEN = "/get-invitation-by-token";

  fastify.post(
    ROUTE_INVITATION,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.sendInvitation
  );

  fastify.get(ROUTE_GET_INVITATION_BY_TOKEN, handlers.getInvitationByToken);

  done();
};

export default plugin;
