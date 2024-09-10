import handlers from "./handlers";
import {
  ROUTE_USER_DEVICE_ADD,
  ROUTE_USER_DEVICE_REMOVE,
} from "../../constants";
import isFirebaseEnabled from "../../middlewares/isFirebaseEnabled";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void,
) => {
  const handlersConfig = fastify.config.firebase.handlers?.userDevice;

  fastify.post(
    ROUTE_USER_DEVICE_ADD,
    {
      preHandler: [fastify.verifySession(), isFirebaseEnabled(fastify)],
    },
    handlersConfig?.addUserDevice || handlers.addUserDevice,
  );

  fastify.delete(
    ROUTE_USER_DEVICE_REMOVE,
    {
      preHandler: [fastify.verifySession(), isFirebaseEnabled(fastify)],
    },
    handlersConfig?.removeUserDevice || handlers.removeUserDevice,
  );

  done();
};

export default plugin;
