import Service from "../service";

import type {
  Permission,
  PermissionCreateInput,
  PermissionUpdateInput,
} from "../../../types/permission";
import type { FastifyReply, FastifyRequest } from "fastify";

const role = async (request: FastifyRequest, reply: FastifyReply) => {
  const { config, params, slonik } = request;

  const service = new Service<
    Permission,
    PermissionCreateInput,
    PermissionUpdateInput
  >(config, slonik);

  const { id } = params as { id: number };

  const data = await service.findById(id);

  reply.send(data);
};

export default role;
