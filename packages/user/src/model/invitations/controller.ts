import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_INVITATION = "/invitation";

  fastify.post(
    ROUTE_INVITATION,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.sendInvitation
  );

  done();
};

export default plugin;
