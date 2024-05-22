import Service from "../service";

import type { Role, RoleCreateInput, RoleUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const roles = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, query, slonik } = request;

  const service = new Service<Role, RoleCreateInput, RoleUpdateInput>(
    config,
    slonik
  );

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

export default roles;
