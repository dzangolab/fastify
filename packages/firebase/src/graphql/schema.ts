import { baseSchema, mergeTypeDefs } from "@dzangolab/fastify-graphql";

import notificationSchema from "../model/notification/schema";
import userDeviceSchema from "../model/userDevice/schema";

export default mergeTypeDefs([
  baseSchema,
  notificationSchema,
  userDeviceSchema,
]);
