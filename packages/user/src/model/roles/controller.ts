import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(
    "/roles",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.roles
  );

  fastify.get(
    "/roles/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.role
  );

  fastify.delete(
    "/roles/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.deleteRole
  );

  fastify.post(
    "/roles",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.create
  );

  fastify.put(
    "/roles/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.update
  );

  done();
};

export default plugin;
