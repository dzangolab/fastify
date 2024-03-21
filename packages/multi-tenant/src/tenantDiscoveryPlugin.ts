import FastifyPlugin from "fastify-plugin";

import discoverTenant from "./lib/discoverTenant";
import getHost from "./lib/getHost";
import getMultiTenantConfig from "./lib/getMultiTenantConfig";

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
        const tenant = await discoverTenant(config, database, getHost(url));

        if (tenant) {
          request.tenant = tenant;

          request.dbSchema =
            tenant[getMultiTenantConfig(config).table.columns.slug];
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
