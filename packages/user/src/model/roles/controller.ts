import handlers from "./handlers";
import { ROUTE_ROLES, ROUTE_ROLES_PERMISSIONS } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.delete(
    ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.deleteRole,
  );

  fastify.get(
    ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getRoles,
  );

  fastify.get(
    ROUTE_ROLES_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getPermissions,
  );

  fastify.post(
    ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.createRole,
  );

  fastify.put(
    ROUTE_ROLES_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.updatePermissions,
  );
};

export default plugin;
