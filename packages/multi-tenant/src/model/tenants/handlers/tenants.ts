import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_TENANT_OWNER } from "../../../constants";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const tenants = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.tenant) {
    throw {
      name: "LIST_TENANTS_FAILED",
      message: "Tenant app cannot display a list of tenants",
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

    const { limit, offset, filters, sort } = request.query as {
      limit: number;
      offset?: number;
      filters?: string;
      sort?: string;
    };

    const data = await service.list(
      limit,
      offset,
      filters ? JSON.parse(filters) : undefined,
      sort ? JSON.parse(sort) : undefined
    );

    reply.send(data);
  } else {
    request.log.error("could not get user id from session");
    throw new Error("Oops, Something went wrong");
  }
};

export default tenants;
