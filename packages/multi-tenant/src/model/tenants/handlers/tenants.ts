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

  if (!userId) {
    request.log.error("could not get user id from session");

    reply.status(403).send({
      statusCode: 403,
      error: "unauthenticated",
      message: "Please login to continue",
    });

    return;
  }

  const service = new Service(request.config, request.slonik, request.dbSchema);

  const { roles } = await UserRoles.getRolesForUser(userId);

  // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
  // both roles: ADMIN and TENANT_OWNER
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
    sort ? JSON.parse(sort) : undefined,
  );

  reply.send(data);
};

export default tenants;
