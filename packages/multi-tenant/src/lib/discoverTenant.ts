import { sql } from "slonik";

import getMatch from "./getMatch";
import getMultiTenantConfig from "./multiTenantConfig";
import TenantService from "../model/tenants/service";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { IncomingHttpHeaders } from "node:http";

const discoverTenant = async (
  config: ApiConfig,
  hostname: string,
  slonik: Database,
  headers?: IncomingHttpHeaders
) => {
  const { slugs: reservedSlugs, domains: reservedDomains } =
    getMultiTenantConfig(config).reserved;

  const { matchedDomain, matchedSlug } = getMatch(hostname, headers);

  if (
    reservedDomains.includes(matchedDomain) ||
    reservedSlugs.includes(matchedSlug)
  ) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  if (matchedSlug) {
    const tenantService = TenantService(config, slonik, sql);

    const tenant = await tenantService.findOneBySlug(matchedSlug);

    if (tenant) {
      return tenant;
    }
  }

  throw new Error("Tenant not found");
};

export default discoverTenant;
