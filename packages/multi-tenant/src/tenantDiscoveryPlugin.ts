import FastifyPlugin from "fastify-plugin";

import getMultiTenantConfig from "./lib/multiTenantConfig";
import TenantService from "./model/tenants/service";

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
        let slug = "";
        let domain = "";
        const { config, headers, hostname, slonik, sql } = request;
        const { origin, referer } = headers;

        const url = referer || origin || hostname;

        if (url) {
          const slugMatches = url.match(
            /^(?:https?:\/\/)?(.*?)\.(?=[^/]*\..{2,5})/i
          );
          const domainMatches = url.match(
            /^(?:https?:\/\/)?([\da-z][^\n/?]+)/i
          );

          if (slugMatches) {
            slug = slugMatches[1];
          }

          if (domainMatches) {
            domain = domainMatches[1];
          }
        }

        const { slugs: reservedSlugs, domains: reservedDomains } =
          getMultiTenantConfig(config).reserved;

        if (reservedSlugs.includes(slug) || reservedDomains.includes(domain)) {
          return;
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
