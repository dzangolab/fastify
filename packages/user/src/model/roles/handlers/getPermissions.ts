import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getPermissions = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, slonik, log, query } = request;
  let permissions: string[] = [];

  try {
    let { role } = query as { role?: string };

    if (role) {
      try {
        role = JSON.parse(role) as string;
      } catch {
        /* empty */
      }

      if (typeof role != "string") {
        return reply.send({ permissions });
      }

      const service = new RoleService(config, slonik, dbSchema);

      permissions = await service.getPermissionsForRole(role);
    }

    return reply.send({ permissions });
  } catch (error) {
    log.error(error);
    reply.status(500);

    return reply.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
    });
  }
};

export default getPermissions;
