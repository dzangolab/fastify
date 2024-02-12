import handlers from "./handlers";
import { ROUTE_SEND_NOTIFICATION } from "../../constants";
import isFirebaseEnabled from "../../middlewares/isFirebaseEnabled";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config.firebase.handlers?.userDevice;
  const notificationConfig = fastify.config.firebase.notification;

  if (notificationConfig?.test?.enabled) {
    fastify.post(
      notificationConfig.test.path || ROUTE_SEND_NOTIFICATION,
      {
        preHandler: [fastify.verifySession(), isFirebaseEnabled(fastify)],
      },
      handlersConfig?.addUserDevice || handlers.sendNotification
    );
  }

  done();
};

export default plugin;
