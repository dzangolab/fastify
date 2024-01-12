import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const tenant = async (request: SessionRequest, reply: FastifyReply) => {
  if (request.tenant) {
    throw {
      name: "GET_TENANT_FAILED",
      message: "Tenant app cannot get tenant",
      statusCode: 403,
    };
  }

  const service = new Service(request.config, request.slonik, request.dbSchema);

  const { id } = request.params as { id: number };

  const data = await service.findById(id);

  reply.send(data);
};

export default tenant;
