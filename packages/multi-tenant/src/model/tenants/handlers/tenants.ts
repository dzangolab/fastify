import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_TENANT_OWNER } from "../../../constants";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const tenants = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, query, slonik, tenant, user } = request;

  if (tenant) {
    return reply.status(403).send({
      code: "LIST_TENANTS_FAILED",
      error: "Forbidden",
      message: "Tenant app cannot display a list of tenants",
      statusCode: 403,
    });
  }

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCode: 401,
    });
  }

  const service = new Service(config, slonik, dbSchema);

  const { roles } = await UserRoles.getRolesForUser(user.id);

  // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
  // both roles: ADMIN and TENANT_OWNER
  if (roles.includes(ROLE_TENANT_OWNER)) {
    service.ownerId = user.id;
  }

  const { limit, offset, filters, sort } = query as {
    limit: number;
    offset?: number;
    filters?: string;
    sort?: string;
  };

  const data = await service.list(
    limit,
    offset,
    filters ? JSON.parse(filters) : undefined,
    sort ? JSON.parse(sort) : undefined,
  );

  reply.send(data);
};

export default tenants;
