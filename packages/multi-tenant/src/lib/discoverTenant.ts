import { ApiConfig } from "@dzangolab/fastify-config";

import getAllReservedSlug from "../lib/getAllReservedSlug";
import TenantService from "../model/tenants/service";

import type { Tenant } from "../types";
import type { Database } from "@dzangolab/fastify-slonik";

const discoverTenant = async (
  config: ApiConfig,
  database: Database,
  host: string
): Promise<Tenant | null> => {
  const reservedDomains = config.multiTenant?.reserved?.domains;

  if (reservedDomains && reservedDomains.includes(host)) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (
    getAllReservedSlug(config.multiTenant).some(
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
