import handlers from "./handlers";
import {
  ROUTE_CHANGE_PASSWORD,
  ROUTE_SIGNUP_ADMIN,
  ROUTE_ME,
  ROUTE_USERS,
  ROUTE_USERS_DISABLE,
  ROUTE_USERS_ENABLE,
} from "../../constants";
import hasPermission from "../../lib/hasPermission";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config.user.handlers?.user;

  fastify.get(
    ROUTE_USERS,
    {
      preHandler: [fastify.verifySession(), hasPermission("users:read")],
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

  fastify.put(
    ROUTE_USERS_DISABLE,
    {
      preHandler: [fastify.verifySession(), hasPermission("users:write")],
    },
    handlersConfig?.disable || handlers.disable
  );

  fastify.put(
    ROUTE_USERS_ENABLE,
    {
      preHandler: [fastify.verifySession(), hasPermission("users:write")],
    },
    handlersConfig?.enable || handlers.enable
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
