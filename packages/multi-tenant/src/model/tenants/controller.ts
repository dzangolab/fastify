import Service from "./service";

import type { TenantInput } from "../../types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const controller = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.get(
    "/tenants",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const service = Service(request.config, request.slonik, request.sql);

      const data = await service.all();

      reply.send(data);
    }
  );

  fastify.get(
    "/tenants/:slug",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const service = Service(request.config, request.slonik, request.sql);

      const { slug } = request.params as { slug: string };

      const data = await service.findOneBySlug(slug);

      reply.send(data);
    }
  );

  fastify.post(
    "/tenants",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const service = Service(request.config, request.slonik, request.sql);

      const input = request.body as TenantInput;

      const data = await service.create(input);

      reply.send(data);
    }
  );

  done();
};

export default controller;
