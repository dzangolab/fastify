import * as firebaseAdmin from "firebase-admin";

import { Message } from "../types";

const sendPushNotification = async (message: Message) => {
  await firebaseAdmin.messaging().sendEachForMulticast({
    tokens: [message.token],
    data: message.data,
    notification: message.notification,
  });
};

export default sendPushNotification;
