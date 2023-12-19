import { FastifyReply } from "fastify";
import { SessionRequest } from "supertokens-node/framework/fastify";

import Service from "../service";

import type { UserDeviceRemoveInput } from "../../../types";

const removeUserDevice = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const userId = request.session?.getUserId();

  if (userId) {
    const { deviceToken } = request.body as UserDeviceRemoveInput;

    if (deviceToken) {
      const service = new Service(
        request.config,
        request.slonik,
        request.dbSchema
      );

      const userDevices = await service.getByUserId(userId);

      if (!userDevices || userDevices.length === 0) {
        request.log.error("No devices found for user");

        throw new Error("Oops, Something went wrong");
      }

      const deviceToDelete = userDevices.find(
        (device) => device.deviceToken === deviceToken
      );

      if (!deviceToDelete) {
        request.log.error("device requested to delete not owned by user");

        throw new Error("Oops, Something went wrong");
      }

      reply.send(await service.removeByDeviceToken(deviceToken));
    } else {
      request.log.error("device token is not defined");

      throw new Error("Oops, Something went wrong");
    }
  } else {
    request.log.error("could not get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default removeUserDevice;
