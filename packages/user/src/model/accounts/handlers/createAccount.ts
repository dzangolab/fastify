import { AccountsUpdateInput } from "../../../types";
import Service from "../service";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const createAccount = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service(request.config, request.slonik);
  const input = request.body as AccountsUpdateInput;

  const data = await service.create(input);

  reply.send(data);
};

export default createAccount;
