import Service from "../service";

import type { UserDeviceCreateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const addUserDevice = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, log, slonik, user } = request;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  const { deviceToken } = body as UserDeviceCreateInput;

  if (!deviceToken) {
    log.error("device token is not defined");

    throw new Error("Oops, Something went wrong");
  }

  const service = new Service(config, slonik, dbSchema);

  reply.send(await service.create({ userId: user.id, deviceToken }));
};

export default addUserDevice;
