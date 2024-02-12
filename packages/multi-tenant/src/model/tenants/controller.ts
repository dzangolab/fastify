import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(
    "/tenants/all",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.all
  );

  fastify.get(
    "/tenants",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.tenants
  );

  fastify.get(
    "/tenants/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.tenant
  );

  fastify.post(
    "/tenants",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.create
  );

  done();
};

export default plugin;
