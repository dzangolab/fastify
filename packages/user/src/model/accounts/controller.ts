import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config.user.handlers?.account;

  fastify.get(
    "/accounts",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.list || handlers.listAccount
  );

  fastify.get(
    "/accounts/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.account || handlers.account
  );

  fastify.delete(
    "/accounts/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.delete || handlers.deleteAccount
  );

  fastify.post(
    "/accounts",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.createAccount
  );

  fastify.put(
    "/accounts/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.update || handlers.updateAccount
  );

  done();
};

export default plugin;
