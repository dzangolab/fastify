import handlers from "./handlers";
import {
  PERMISSIONS_USERS_DISABLE,
  PERMISSIONS_USERS_ENABLE,
  PERMISSIONS_USERS_LIST,
  ROUTE_CHANGE_PASSWORD,
  ROUTE_SIGNUP_ADMIN,
  ROUTE_ME,
  ROUTE_USERS,
  ROUTE_USERS_DISABLE,
  ROUTE_USERS_ENABLE,
} from "../../constants";

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
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_USERS_LIST),
      ],
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
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_USERS_DISABLE),
      ],
    },
    handlersConfig?.disable || handlers.disable
  );

  fastify.put(
    ROUTE_USERS_ENABLE,
    {
      preHandler: [
        fastify.verifySession(),
        fastify.hasPermission(PERMISSIONS_USERS_ENABLE),
      ],
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
