import handlers from "./handlers";
import { ROUTE_ROLES, ROUTE_ROLES_PERMISSIONS } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.delete(
    ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.deleteRole
  );

  fastify.get(
    ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getRoles
  );

  fastify.get(
    ROUTE_ROLES_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getPermissions
  );

  fastify.post(
    ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.createRole
  );

  fastify.put(
    ROUTE_ROLES_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.updatePermissions
  );

  done();
};

export default plugin;
