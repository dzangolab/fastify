import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getRoles = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, log, slonik } = request;

  try {
    const service = new RoleService(config, slonik, dbSchema);

    const roles = await service.getRoles();

    return reply.send({ roles });
  } catch (error) {
    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default getRoles;
