import handlers from "./handlers";
import { ADD_DEVICE_PATH } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config?.handlers?.userDevice;

  fastify.post(
    ADD_DEVICE_PATH,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.addDevice || handlers.addDevice
  );

  done();
};

export default plugin;
