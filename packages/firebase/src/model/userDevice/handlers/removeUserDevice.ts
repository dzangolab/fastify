import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const removeUserDevice = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const userId = request.session?.getUserId();

  if (!userId) {
    request.log.error("could not get user id from session");

    return reply.status(403).send({
      statusCode: 403,
      error: "unauthenticated",
      message: "Please login to continue",
    });
  }

  const { deviceToken } = request.body as { deviceToken: string };

  if (!deviceToken) {
    request.log.error("device token is not defined");

    throw new Error("Oops, Something went wrong");
  }

  const service = new Service(request.config, request.slonik, request.dbSchema);

  const userDevices = await service.getByUserId(userId);

  if (!userDevices || userDevices.length === 0) {
    request.log.error("No devices found for user");

    throw new Error("Oops, Something went wrong");
  }

  const deviceToDelete = userDevices.find(
    (device) => device.deviceToken === deviceToken,
  );

  if (!deviceToDelete) {
    request.log.error("device requested to delete not owned by user");

    throw new Error("Oops, Something went wrong");
  }

  reply.send(await service.removeByDeviceToken(deviceToken));
};

export default removeUserDevice;
