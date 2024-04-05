import handlers from "./handlers";
import { ROUTE_ROLES, ROUTE_ROLES_PERMISSIONS } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const OWN_ROUTE_ROLES = `/own${ROUTE_ROLES}`;

  const OWN_ROUTE_ROLES_PERMISSIONS = `/own${ROUTE_ROLES_PERMISSIONS}`;

  fastify.delete(
    OWN_ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.deleteRole
  );

  fastify.get(
    OWN_ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getRoles
  );

  fastify.get(
    OWN_ROUTE_ROLES_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getPermissions
  );

  fastify.post(
    OWN_ROUTE_ROLES,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.createRole
  );

  fastify.put(
    OWN_ROUTE_ROLES_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.updatePermissions
  );

  done();
};

export default plugin;
