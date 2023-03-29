import Service from "./service";

import type { FastifyInstance, FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const ROUTE_USERS = "/users";

  fastify.get(
    ROUTE_USERS,
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const { limit, offset, filters, sort } = request.query as {
        limit: number;
        offset?: number;
        filters?: string;
        sort?: string;
      };

      const data = await service.paginatedList(
        limit,
        offset,
        filters ? JSON.parse(filters) : undefined,
        sort ? JSON.parse(sort) : undefined
      );

      reply.send(data);
    }
  );

  done();
};

export default plugin;
