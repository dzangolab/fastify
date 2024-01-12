import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_TENANT_OWNER } from "../../../constants";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const tenant = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.tenant) {
    throw {
      name: "GET_TENANT_FAILED",
      message: "Tenant app cannot retrieve tenant information",
      statusCode: 403,
    };
  }

  const userId = request.session?.getUserId();

  if (userId) {
    const service = new Service(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const { roles } = await UserRoles.getRolesForUser(userId);

    if (roles.includes(ROLE_TENANT_OWNER)) {
      service.ownerId = userId;
    }

    const { id } = request.params as { id: number };

    const data = await service.findById(id);

    reply.send(data);
  } else {
    request.log.error("could not get user id from session");
    throw new Error("Oops, Something went wrong");
  }
};

export default tenant;
