import handlers from "./handlers";
import {
  ROUTE_PERMISSIONS,
  ROUTE_PERMISSIONS_CREATE,
  ROUTE_PERMISSIONS_DELETE,
  ROUTE_PERMISSIONS_GET_BY_ID,
  ROUTE_PERMISSIONS_UPDATE,
} from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(ROUTE_PERMISSIONS, handlers.permissions);

  fastify.get(ROUTE_PERMISSIONS_GET_BY_ID, handlers.permission);

  fastify.delete(ROUTE_PERMISSIONS_DELETE, handlers.remove);

  fastify.post(ROUTE_PERMISSIONS_CREATE, handlers.create);

  fastify.put(ROUTE_PERMISSIONS_UPDATE, handlers.update);

  done();
};

export default plugin;
