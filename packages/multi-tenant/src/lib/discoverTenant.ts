import getMatch from "./getMatch";
import getMultiTenantConfig from "./multiTenantConfig";
import TenantService from "../model/tenants/service";

import type { MultiTenantEnabledConfig } from "../types";
import type { Database } from "@dzangolab/fastify-slonik";

const discoverTenant = async (
  config: MultiTenantEnabledConfig,
  slonik: Database,
  url: string
) => {
  const { slugs: reservedSlugs, domains: reservedDomains } =
    getMultiTenantConfig(config).reserved;

  const { matchedDomain, matchedSlug } = getMatch(url);

  if (
    reservedDomains.includes(matchedDomain) ||
    reservedSlugs.includes(matchedSlug)
  ) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (matchedSlug) {
    const tenantService = TenantService(config, slonik);

    const tenant = await tenantService.findOneBySlug(matchedSlug);

    if (tenant) {
      return tenant;
    }
  }

  throw new Error("Tenant not found");
};

export default discoverTenant;
