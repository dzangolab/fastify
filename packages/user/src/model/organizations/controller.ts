import Service from "./service";

import type { OrganizationsUpdateInput } from "../../types";
import type { FastifyInstance, FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(
    "/organizations",
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

      const data = await service.list(
        limit,
        offset,
        filters ? JSON.parse(filters) : undefined,
        sort ? JSON.parse(sort) : undefined
      );

      reply.send(data);
    }
  );

  fastify.get(
    "/organizations/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply) => {
      const service = new Service(request.config, request.slonik);

      const { id } = request.params as { id: number };

      const data = await service.findById(id);

      reply.send(data);
    }
  );

  fastify.delete(
    "/organizations/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const { id } = request.params as { id: number };

      const data = await service.delete(id);

      reply.send(data);
    }
  );

  fastify.post(
    "/organizations",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);
      const input = request.body as OrganizationsUpdateInput;

      const data = await service.create(input);

      reply.send(data);
    }
  );

  fastify.put(
    "/organizations/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    async (request: SessionRequest, reply: FastifyReply) => {
      const service = new Service(request.config, request.slonik);

      const { id } = request.params as { id: number };

      const input = request.body as OrganizationsUpdateInput;

      const data = await service.update(id, input);

      reply.send(data);
    }
  );

  done();
};

export default plugin;
