import handlers from "./handlers";
import { ROUTE_SEND_NOTIFICATION } from "../../constants";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config?.handlers?.userDevice;
  const notificationConfig = fastify.config?.notification;

  if (notificationConfig?.test?.enabled) {
    fastify.post(
      ROUTE_SEND_NOTIFICATION,
      {
        preHandler: fastify.verifySession(),
      },
      handlersConfig?.addUserDevice || handlers.sendNotification
    );
  }

  done();
};

export default plugin;
