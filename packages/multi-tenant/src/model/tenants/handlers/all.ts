import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_TENANT_OWNER } from "../../../constants";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const all = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, query, slonik, tenant, user } = request;

  if (tenant) {
    throw {
      name: "GET_ALL_TENANTS_FAILED",
      message: "Tenant app cannot display all tenants",
      statusCode: 403,
    };
  }

  if (!user) {
    return reply.status(401).send({
      error: "UNAUTHORIZED",
      message: "unauthorized",
    });
  }

  const service = new Service(config, slonik, dbSchema);

  const { roles } = await UserRoles.getRolesForUser(user.id);

  // [DU 2024-JAN-15] TODO: address the scenario in which a user possesses
  // both roles: ADMIN and TENANT_OWNER
  if (roles.includes(ROLE_TENANT_OWNER)) {
    service.ownerId = user.id;
  }

  const { fields } = query as {
    fields: string;
  };

  const data = await service.all(JSON.parse(fields) as string[]);

  reply.send(data);
};

export default all;
