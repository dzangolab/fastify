import { messaging } from "firebase-admin";

import { Message } from "../types";

const sendPushNotification = async (message: Message) => {
  await messaging().sendEachForMulticast({
    tokens: message.tokens,
    data: message.data,
    notification: message.notification,
  });
};

export default sendPushNotification;
