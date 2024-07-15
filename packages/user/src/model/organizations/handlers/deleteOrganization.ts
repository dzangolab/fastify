import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const deleteInvitation = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  const data = await service.delete(id);

  reply.send(data);
};

export default deleteInvitation;
