import { FastifyReply } from "fastify";
import { SessionRequest } from "supertokens-node/framework/fastify";

import Service from "../service";

import type { UserDeviceCreateInput } from "../../../types";

const addUserDevice = async (request: SessionRequest, reply: FastifyReply) => {
  const userId = request.session?.getUserId();

  if (!userId) {
    request.log.error("could not get user id from session");

    throw new Error("Oops, Something went wrong");
  }

  const { deviceToken } = request.body as UserDeviceCreateInput;

  if (!deviceToken) {
    request.log.error("device token is not defined");

    throw new Error("Oops, Something went wrong");
  }

  const service = new Service(request.config, request.slonik, request.dbSchema);

  reply.send(await service.create({ userId, deviceToken }));
};

export default addUserDevice;
