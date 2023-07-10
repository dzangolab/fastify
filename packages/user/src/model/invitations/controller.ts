import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_SEND_INVITATION = "/invitation";
  const ROUTE_VALIDATE_INVITATION = "/invitation/validation";

  fastify.post(
    ROUTE_SEND_INVITATION,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.sendInvitation
  );

  fastify.get(ROUTE_VALIDATE_INVITATION, handlers.validateInvitation);

  done();
};

export default plugin;
