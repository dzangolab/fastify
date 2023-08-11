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
  fastify.get(
    ROUTE_USERS,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.users
  );

  fastify.post(
    ROUTE_CHANGE_PASSWORD,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.changePassword
  );

  fastify.get(
    ROUTE_ME,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.me
  );

  fastify.put(
    ROUTE_ME,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.updateMe
  );

  fastify.post(ROUTE_SIGNUP_ADMIN, handlers.signUpAdmin);

  fastify.get(ROUTE_SIGNUP_ADMIN, handlers.canSignUpAdmin);

  done();
};

export default plugin;
