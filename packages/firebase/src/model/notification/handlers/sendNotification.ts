import { sendPushNotification } from "../../../lib";
import DeviceService from "../../userDevice/service";

import type { TestNotificationInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const testPushNotification = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const userId = request.session?.getUserId();

  if (!userId) {
    request.log.error("user id is not defined");

    throw new Error("Oops, Please login to continue");
  }

  const {
    body,
    title,
    data,
    userId: receiverId,
  } = request.body as TestNotificationInput;

  if (!receiverId) {
    request.log.error("receiver id is not defined");

    throw new Error("Oops, Please provide a receiver id");
  }

  const service = new DeviceService(
    request.config,
    request.slonik,
    request.dbSchema
  );

  const receiverDevices = await service.getByUserId(receiverId);

  if (!receiverDevices || receiverDevices.length === 0) {
    request.log.error("no device found for the receiver");

    throw new Error("Unable to find device for the receiver");
  }

  const tokens = receiverDevices.map((device) => device.deviceToken as string);

  const message: MulticastMessage = {
    android: {
      priority: "high",
      notification: {
        sound: "default",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
    tokens,
    notification: {
      title,
      body,
    },
    data: {
      ...data,
      title,
      body,
    },
  };

  await sendPushNotification(message);

  reply.send({ message: "Notification sent successfully" });
};

export default testPushNotification;
