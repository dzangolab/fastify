import handlers from "./handlers";
import { ROUTE_USER_DEVICE_ADD } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config?.handlers?.userDevice;

  fastify.post(
    ROUTE_USER_DEVICE_ADD,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.addUserDevice || handlers.addUserDevice
  );

  done();
};

export default plugin;
