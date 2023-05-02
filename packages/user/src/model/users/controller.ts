import handlers from "./lib/handler";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_CHANGE_PASSWORD = "/change_password";
  const ROUTE_ME = "/me";
  const ROUTE_USERS = "/users";

  fastify.get(
    ROUTE_USERS,
    {
      preHandler: fastify.verifySession(),
    },
    fastify.config.user.rest?.handlers?.users || handlers.users
  );

  fastify.post(
    ROUTE_CHANGE_PASSWORD,
    {
      preHandler: fastify.verifySession(),
    },
    fastify.config.user.rest?.handlers?.changePassword ||
      handlers.changePassword
  );

  fastify.get(
    ROUTE_ME,
    {
      preHandler: fastify.verifySession(),
    },
    fastify.config.user.rest?.handlers?.me || handlers.me
  );

  done();
};

export default plugin;
