import { ApiConfig } from "@dzangolab/fastify-config";

import getAllReservedDomains from "./getAllReservedDomains";
import getAllReservedSlugs from "./getAllReservedSlugs";
import TenantService from "../model/tenants/service";

import type { Tenant } from "../types";
import type { Database } from "@dzangolab/fastify-slonik";

const discoverTenant = async (
  config: ApiConfig,
  database: Database,
  host: string
): Promise<Tenant | null> => {
  if (getAllReservedDomains(config).includes(host)) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (
    getAllReservedSlugs(config).some(
      (slug: string) => `${slug}.${config.multiTenant.rootDomain}` === host
    )
  ) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  const tenantService = new TenantService(config, database);

  const tenant = await tenantService.findByHostname(host);

  if (tenant) {
    return tenant as Tenant;
  }

  throw new Error("Tenant not found");
};

export default discoverTenant;
