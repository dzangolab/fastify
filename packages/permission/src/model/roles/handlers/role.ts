import Service from "../service";

import type { FastifyReply, FastifyRequest } from "fastify";

const role = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  const data = await service.findById(id);

  reply.send(data);
};

export default role;
