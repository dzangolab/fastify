import FastifyPlugin from "fastify-plugin";

import discoverTenant from "./lib/discoverTenant";

import type { Tenant } from "./types";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tenant = await discoverTenant(
          request.config,
          request.hostname,
          request.slonik,
          request.headers
        );

        if (tenant) {
          request.tenant = tenant as Tenant;
        }
      } catch (error) {
        fastify.log.error(error);

        reply.send({ error: { message: "Tenant not found" } });
      }
    }
  );

  done();
};

export default FastifyPlugin(plugin);
