import handlers from "./handlers";
import { ROUTE_PERMISSIONS } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void,
) => {
  fastify.get(
    ROUTE_PERMISSIONS,
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.getPermissions,
  );

  done();
};

export default plugin;
