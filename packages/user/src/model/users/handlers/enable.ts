import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const enable = async (request: SessionRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  const service = new Service(request.config, request.slonik, request.dbSchema);

  const response = await service.update(id, { disabled: false });

  if (!response) {
    reply.status(404);

    return await reply.send({ message: `userid ${id} not found` });
  }

  return await reply.send({ status: "OK" });
};

export default enable;
