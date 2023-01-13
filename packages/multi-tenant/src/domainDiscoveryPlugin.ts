import FastifyPlugin from "fastify-plugin";

import TenantService from "./model/tenants/service";
import { Tenant } from "./types";

import type { FastifyInstance, FastifyRequest } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.addHook("preHandler", async (request: FastifyRequest) => {
    try {
      const { config, headers, hostname, slonik, sql } = request;
      const { origin, referer } = headers;

      const url = referer || origin || hostname;

      if (!url) {
        return;
      }

      const matches = url.match(/(?:https*:\/\/)*(.*?)\.(?=[^/]*\..{2,5})/i);

      if (!matches) {
        return;
      }

      const slug = matches[1];

      const tenantService = TenantService(config, slonik, sql);

      const tenant = await tenantService.findOneBySlug(slug);

      if (tenant) {
        request.tenant = tenant as Tenant;
      }
    } catch (error) {
      fastify.log.error(error);
    }
  });

  done();
};

export default FastifyPlugin(plugin);
