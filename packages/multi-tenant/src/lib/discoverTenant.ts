import getMatch from "./getMatch";
import getMultiTenantConfig from "./multiTenantConfig";
import TenantService from "../model/tenants/service";

import type { Tenant } from "../types";
import type { FastifyReply, FastifyRequest } from "fastify";

const discoverTenant = async (request: FastifyRequest, reply: FastifyReply) => {
  const { config, slonik, sql } = request;

  const { slugs: reservedSlugs, domains: reservedDomains } =
    getMultiTenantConfig(config).reserved;

  const { matchedDomain, matchedSlug } = getMatch(request);

  if (
    !reservedDomains.includes(matchedDomain) ||
    !reservedSlugs.includes(matchedSlug)
  ) {
    if (!matchedSlug) {
      reply.send({
        error: {
          message: "Tenant not found",
        },
      });
    }

    const tenantService = TenantService(config, slonik, sql);

    const tenant = await tenantService.findOneBySlug(matchedSlug);

    if (!tenant) {
      request.tenant = tenant as unknown as Tenant;
    }
  }
};

export default discoverTenant;
