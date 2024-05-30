import { baseSchema, mergeTypeDefs } from "@dzangolab/fastify-mercurius";

import notificationSchema from "../model/notification/schema";
import userDeviceSchema from "../model/userDevice/schema";

export default mergeTypeDefs([
  baseSchema,
  notificationSchema,
  userDeviceSchema,
]);
