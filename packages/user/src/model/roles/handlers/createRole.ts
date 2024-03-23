import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const createRole = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, log } = request;

  const { role, permissions } = body as {
    role: string;
    permissions: string[];
  };

  try {
    const service = new RoleService();

    const createResponse = await service.createRole(role, permissions);

    return reply.send(createResponse);
  } catch (error) {
    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default createRole;
