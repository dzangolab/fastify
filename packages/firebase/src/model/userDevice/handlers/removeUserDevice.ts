import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const removeUserDevice = async (
  request: SessionRequest,
  reply: FastifyReply,
) => {
  const user = request.user;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  const { deviceToken } = request.body as { deviceToken: string };

  if (!deviceToken) {
    request.log.error("device token is not defined");

    throw new Error("Oops, Something went wrong");
  }

  const service = new Service(request.config, request.slonik, request.dbSchema);

  const userDevices = await service.getByUserId(user.id);

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
