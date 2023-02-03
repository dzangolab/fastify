import { ApiConfig } from "@dzangolab/fastify-config";

import getDomain from "./getDomain";
import getMultiTenantConfig from "./multiTenantConfig";
import TenantService from "../model/tenants/service";

import type { Database } from "@dzangolab/fastify-slonik";

const discoverTenant = async (
  config: ApiConfig,
  database: Database,
  url: string
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const domain = getDomain(url);

  if (
    multiTenantConfig.reserved.slugs.some(
      (slug: string) => slug + "." + multiTenantConfig.rootDomain === domain
    )
  ) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (domain) {
    const tenantService = TenantService(config, database);

    const tenant = await tenantService.findByHostname(domain);

    if (tenant) {
      return tenant;
    }
  }

  throw new Error("Tenant not found");
};

export default discoverTenant;
