import handlers from "./handlers";
import { sendNotificationSchema } from "./schema";
import { ROUTE_SEND_NOTIFICATION } from "../../constants";
import isFirebaseEnabled from "../../middlewares/isFirebaseEnabled";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.firebase.handlers?.userDevice;
  const notificationConfig = fastify.config.firebase.notification;

  if (notificationConfig?.test?.enabled) {
    fastify.post(
      notificationConfig.test.path || ROUTE_SEND_NOTIFICATION,
      {
        preHandler: [fastify.verifySession(), isFirebaseEnabled(fastify)],
        schema: sendNotificationSchema,
      },
      handlersConfig?.addUserDevice || handlers.sendNotification,
    );
  }
};

export default plugin;
