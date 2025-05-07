import handlers from "./handlers";
import {
  ROUTE_USER_DEVICE_ADD,
  ROUTE_USER_DEVICE_REMOVE,
} from "../../constants";
import isFirebaseEnabled from "../../middlewares/isFirebaseEnabled";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.firebase.handlers?.userDevice;

  fastify.post(
    ROUTE_USER_DEVICE_ADD,
    {
      preHandler: [fastify.verifySession(), isFirebaseEnabled(fastify)],
      schema: {
        body: {
          type: "object",
          properties: {
            userId: { type: "string" },
            deviceId: { type: "string" },
            platform: { type: "string" },
          },
          required: ["userId", "deviceId", "platform"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    handlersConfig?.addUserDevice || handlers.addUserDevice,
  );

  fastify.delete(
    ROUTE_USER_DEVICE_REMOVE,
    {
      preHandler: [fastify.verifySession(), isFirebaseEnabled(fastify)],
      schema: {
        querystring: {
          type: "object",
          properties: {
            userId: { type: "string" },
            deviceId: { type: "string" },
          },
          required: ["userId", "deviceId"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    handlersConfig?.removeUserDevice || handlers.removeUserDevice,
  );
};

export default plugin;
