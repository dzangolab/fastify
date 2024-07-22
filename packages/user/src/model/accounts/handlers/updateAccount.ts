import Service from "../service";

import type { AccountUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updateAccount = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);

  const { id } = request.params as { id: number };

  const input = request.body as AccountUpdateInput;

  const data = await service.update(id, input);

  reply.send(data);
};

export default updateAccount;
