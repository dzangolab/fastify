import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const deleteRole = async (request: SessionRequest, reply: FastifyReply) => {
  const { log, query } = request;

  try {
    let { role } = query as { role?: string };

    try {
      role = JSON.parse(role || `""`) as string;
    } catch {
      /* empty */
    }

    if (role) {
      const service = new RoleService();

      return await service.deleteRole(role);
    }
    return { status: "UNKNOWN_ROLE_ERROR" };
  } catch (error) {
    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default deleteRole;
