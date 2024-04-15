import Service from "../service";

import type { Role, RoleCreateInput, RoleUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const role = async (request: SessionRequest, reply: FastifyReply) => {
  const service = new Service<Role, RoleCreateInput, RoleUpdateInput>(
    request.config,
    request.slonik
  );

  const { id } = request.params as { id: number };

  const data = await service.findById(id);

  reply.send(data);
};

export default role;
