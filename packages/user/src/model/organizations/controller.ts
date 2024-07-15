import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config.user.handlers?.organization;

  fastify.get(
    "/organizations",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.list || handlers.listOrganization
  );

  fastify.get(
    "/organizations/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.organization || handlers.organization
  );

  fastify.delete(
    "/organizations/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.delete || handlers.deleteOrganization
  );

  fastify.post(
    "/organizations",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.createOrganization
  );

  fastify.put(
    "/organizations/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.update || handlers.updateOrganization
  );

  done();
};

export default plugin;
