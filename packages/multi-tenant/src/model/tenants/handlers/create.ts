import getMultiTenantConfig from "../../../lib/getMultiTenantConfig";
import Service from "../service";

import type { TenantCreateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, slonik, tenant, user } = request;

  if (tenant) {
    return reply.status(403).send({
      code: "CREATE_TENANT_FAILED",
      error: "Forbidden",
      message: "Tenant app cannot be used to create tenant",
      statusCode: 403,
    });
  }

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "unauthorized",
      statusCOde: 401,
    });
  }

  const input = body as TenantCreateInput;

  const multiTenantConfig = getMultiTenantConfig(config);

  input[multiTenantConfig.table.columns.ownerId] = user.id;

  const service = new Service(config, slonik);

  const data = await service.create(input);

  reply.send(data);
};

export default create;
