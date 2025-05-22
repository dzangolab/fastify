import handlers from "./handlers";
import { getPermissionsSchema } from "./schema";
import { ROUTE_PERMISSIONS } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.get(
    ROUTE_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
      schema: getPermissionsSchema,
    },
    handlers.getPermissions,
  );
};

export default plugin;
