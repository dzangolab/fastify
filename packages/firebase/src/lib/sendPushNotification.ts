import { messaging } from "firebase-admin";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";

const sendPushNotification = async (message: MulticastMessage) => {
  await messaging().sendEachForMulticast(message);
};

export default sendPushNotification;
