import { FastifyReply } from "fastify";
import { SessionRequest } from "supertokens-node/framework/fastify";

import { sendPushNotification } from "../../../lib";
import Service from "../../userDevice/service";

import type { Message, TestNotificationInput } from "../../../types";

const testPushNotification = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const userId = request.session?.getUserId();

  if (userId) {
    const {
      body,
      title,
      userId: receiverId,
    } = request.body as TestNotificationInput;

    if (!receiverId) {
      request.log.error("receiver id is not defined");

      throw new Error("Oops, Please provide a receiver id");
    }

    const service = new Service(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const userDevice = await service.getByUserId(receiverId);

    if (!userDevice) {
      request.log.error("no device found for the receiver");

      throw new Error("Unable to find device for the receiver");
    }

    const fcmToken = userDevice.deviceToken as string;

    const message: Message = {
      tokens: [fcmToken],
      notification: {
        title,
        body,
      },
    };

    await sendPushNotification(message);

    reply.send({ message: "Notification sent successfully" });
  } else {
    request.log.error("could not get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default testPushNotification;
