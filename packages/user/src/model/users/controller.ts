import handlers from "./handlers";
import {
  ROUTE_CHANGE_PASSWORD,
  ROUTE_SIGNUP_ADMIN,
  ROUTE_ME,
  ROUTE_USERS,
} from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config.user.user?.handlers;

  fastify.get(
    ROUTE_USERS,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.users || handlers.users
  );

  fastify.post(
    ROUTE_CHANGE_PASSWORD,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.changePassword || handlers.changePassword
  );

  fastify.get(
    ROUTE_ME,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.me || handlers.me
  );

  fastify.put(
    ROUTE_ME,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.updateMe || handlers.updateMe
  );

  fastify.post(
    ROUTE_SIGNUP_ADMIN,
    handlersConfig?.adminSignUp || handlers.adminSignUp
  );

  fastify.get(
    ROUTE_SIGNUP_ADMIN,
    handlersConfig?.canAdminSignUp || handlers.canAdminSignUp
  );

  done();
};

export default plugin;
