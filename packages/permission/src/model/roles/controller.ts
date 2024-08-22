import handlers from "./handlers";
import {
  ROUTE_ROLES,
  ROUTE_ROLES_CREATE,
  ROUTE_ROLES_DELETE,
  ROUTE_ROLES_GET_BY_ID,
  ROUTE_ROLES_UPDATE,
} from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(ROUTE_ROLES, handlers.roles);

  fastify.get(ROUTE_ROLES_GET_BY_ID, handlers.role);

  fastify.delete(ROUTE_ROLES_DELETE, handlers.remove);

  fastify.post(ROUTE_ROLES_CREATE, handlers.create);

  fastify.put(ROUTE_ROLES_UPDATE, handlers.update);

  done();
};

export default plugin;
