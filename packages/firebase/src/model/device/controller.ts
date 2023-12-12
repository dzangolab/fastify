import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.post(
    "/add-device",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.addDevice
  );
};

export default plugin;
