import FastifyPlugin from "fastify-plugin";

import TenantService from "./model/tenants/service";
import { Tenant } from "./types";

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
        let slug = "";
        const { config, headers, hostname, slonik, sql } = request;
        const { origin, referer } = headers;

        let url = referer || origin || hostname;

        if (!url) {
          url = "";
        }

        const matches = url.match(/(?:https*:\/\/)*(.*?)\.(?=[^/]*\..{2,5})/i);

        if (matches) {
          slug = matches[1];
        }

        if (slug) {
          const tenantService = TenantService(config, slonik, sql);

          const tenant = await tenantService.findOneBySlug(slug);

          if (tenant) {
            request.tenant = tenant as Tenant;

            return;
          }
        }

        return reply.send({
          error: {
            message: "Tenant not found",
          },
        });
      } catch (error) {
        fastify.log.error(error);
      }
    }
  );

  done();
};

export default FastifyPlugin(plugin);
