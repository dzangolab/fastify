import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import mercurius, { MercuriusContext } from "mercurius";

import { sendPushNotification } from "../../lib";
import UserDeviceService from "../userDevice/service";

import "@dzangolab/fastify-graphql";

const Mutation = {
  sendNotification: async (
    parent: unknown,
    arguments_: {
      data: {
        userId: string;
        title: string;
        body: string;
        data: {
          [key: string]: string;
        };
      };
    },
    context: MercuriusContext
  ) => {
    const { app, config, dbSchema, database, user } = context;
    const userId = user?.id;

    if (!userId) {
      new mercurius.ErrorWithProps("Could not get user id", {}, 403);
    }

    if (config.firebase.enabled === false) {
      return new mercurius.ErrorWithProps("Firebase is not enabled", {}, 404);
    }

    try {
      const { userId: receiverId, title, body, data } = arguments_.data;

      if (!receiverId) {
        return new mercurius.ErrorWithProps("Receiver id is required", {}, 400);
      }

      const userDeviceService = new UserDeviceService(
        config,
        database,
        dbSchema
      );

      const receiverDevices = await userDeviceService.getByUserId(receiverId);

      if (!receiverDevices || receiverDevices.length === 0) {
        return new mercurius.ErrorWithProps(
          "Receiver device not found",
          {},
          404
        );
      }

      const tokens = receiverDevices.map(
        (device) => device.deviceToken as string
      );

      const message: MulticastMessage = {
        tokens,
        notification: {
          title,
          body,
        },
        data,
      };

      await sendPushNotification(message);

      return { message: "Notification sent successfully" };
    } catch (error) {
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

const Query = {};

export default { Mutation, Query };
