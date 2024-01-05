import { validateTenantInput } from "../../../lib/validateTenantSchema";
import Service from "../service";

import type { TenantCreateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const create = async (request: SessionRequest, reply: FastifyReply) => {
  const input = request.body as TenantCreateInput;

  validateTenantInput(request.config, input);

  const service = new Service(request.config, request.slonik);

  const data = await service.create(input);

  reply.send(data);
};

export default create;
