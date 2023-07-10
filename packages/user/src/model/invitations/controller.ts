import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_INVITATIONS = "/invitations";

  fastify.post(
    ROUTE_INVITATIONS,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.sendInvitation
  );

  done();
};

export default plugin;
