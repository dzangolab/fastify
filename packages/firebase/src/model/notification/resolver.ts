import { mercurius } from "mercurius";

import { sendPushNotification } from "../../lib";
import UserDeviceService from "../userDevice/service";

import type { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import type { MercuriusContext } from "mercurius";

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
    context: MercuriusContext,
  ) => {
    const { app, config, dbSchema, database, user } = context;

    if (!user) {
      return new mercurius.ErrorWithProps("unauthorized", {}, 401);
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
        dbSchema,
      );

      const receiverDevices = await userDeviceService.getByUserId(receiverId);

      if (!receiverDevices || receiverDevices.length === 0) {
        return new mercurius.ErrorWithProps(
          "Receiver device not found",
          {},
          404,
        );
      }

      const tokens = receiverDevices.map(
        (device) => device.deviceToken as string,
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

      return new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
        {},
        500,
      );
    }
  },
};

const Query = {};

export default { Mutation, Query };
