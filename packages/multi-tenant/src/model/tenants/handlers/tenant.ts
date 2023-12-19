import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const tenant = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik, request.dbSchema);

  const { id } = request.params as { id: number };

  const data = await service.findById(id);

  reply.send(data);
};

export default tenant;
