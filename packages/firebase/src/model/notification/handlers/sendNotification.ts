import { FastifyReply } from "fastify";
import { SessionRequest } from "supertokens-node/framework/fastify";

import { sendPushNotification } from "../../../lib";
import DeviceService from "../../userDevice/service";

import type { Message, TestNotificationInput } from "../../../types";

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

  const receiverDevice = await service.getByUserId(receiverId);

  if (!receiverDevice) {
    request.log.error("no device found for the receiver");

    throw new Error("Unable to find device for the receiver");
  }

  const fcmToken = receiverDevice.deviceToken as string;

  const message: Message = {
    tokens: [fcmToken],
    notification: {
      title,
      body,
    },
  };

  await sendPushNotification(message);

  reply.send({ message: "Notification sent successfully" });
};

export default testPushNotification;
