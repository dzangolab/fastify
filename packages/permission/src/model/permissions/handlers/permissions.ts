import Service from "../service";

import type {
  Permission,
  PermissionCreateInput,
  PermissionUpdateInput,
} from "../../../types/permission";
import type { FastifyReply, FastifyRequest } from "fastify";

const getPermissions = async (request: FastifyRequest, reply: FastifyReply) => {
  const { config, query, slonik } = request;

  const service = new Service<
    Permission,
    PermissionCreateInput,
    PermissionUpdateInput
  >(config, slonik);

  const { limit, offset, filters, sort } = query as {
    limit: number;
    offset?: number;
    filters?: string;
    sort?: string;
  };

  const data = await service.list(
    limit,
    offset,
    filters ? JSON.parse(filters) : undefined,
    sort ? JSON.parse(sort) : undefined
  );

  reply.send(data);
};

export default getPermissions;
