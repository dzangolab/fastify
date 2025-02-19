import handlers from "./handlers";
import { ROUTE_PERMISSIONS } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.get(
    ROUTE_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getPermissions,
  );
};

export default plugin;
