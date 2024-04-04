import RoleService from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const getPermissions = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, slonik, log, query } = request;
  try {
    let { role } = query as { role?: number };

    if (role) {
      try {
        role = JSON.parse(role as unknown as string) as number;
      } catch {
        /* empty */
      }

      if (typeof role != "number") {
        throw new TypeError("Invalid input");
      }

      const service = new RoleService(config, slonik, dbSchema);

      const permissions = await service.getPermissionsForRole(role);

      return permissions;
    }
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
