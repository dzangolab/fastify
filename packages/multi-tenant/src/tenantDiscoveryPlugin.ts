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
      const url =
        request.headers.referer || request.headers.origin || request.hostname;

      const { config, slonik: database } = request;

      try {
        const tenant = await discoverTenant(config, database, url);

        if (tenant) {
          request.tenant = tenant as Tenant;
        }
      } catch (error) {
        fastify.log.error(error);

        return reply.send({ error: { message: "Tenant not found" } });
      }
    }
  );

  done();
};

export default FastifyPlugin(plugin);
