import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updatePermissions = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const { log, body } = request;

  try {
    const { role, permissions } = body as {
      role: string;
      permissions: string[];
    };

    const service = new RoleService();
    const updatedPermissions = await service.updateRolePermissions(
      role,
      permissions
    );

    return reply.send({ permissions: updatedPermissions });
  } catch (error) {
    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default updatePermissions;
