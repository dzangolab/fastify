import { DatabasePoolConnection, sql } from "slonik";

import getMultiTenantConfig from "./multiTenantConfig";

import type { MultiTenantEnabledConfig, Tenant } from "../types";
import type { Database } from "@dzangolab/fastify-slonik";

const discoverTenant = async (
  config: MultiTenantEnabledConfig,
  database: Database,
  url: string
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const reservedDomains: string[] = [];

  for (const reservedSlug of multiTenantConfig.reserved.slugs) {
    reservedDomains.push(reservedSlug + "." + multiTenantConfig.rootDomain);
  }

  let matchedDomain = "";

  const domainMatches = url.match(/^(?:https?:\/\/)?([\da-z][^\n/?]+)/i);

  if (domainMatches) {
    matchedDomain = domainMatches[1];
  }

  if (reservedDomains.includes(matchedDomain)) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (matchedDomain) {
    const tenantQuery = sql<Tenant>`
      SELECT *
      FROM ${multiTenantConfig.table.name}
      WHERE ${sql.identifier([
        multiTenantConfig.table.columns.slug,
      ])} = ${matchedDomain};
    `;

    const tenant = await database.connect(
      async (connection: DatabasePoolConnection) => {
        return connection.maybeOne(tenantQuery);
      }
    );

    if (tenant) {
      return tenant;
    }
  }

  throw new Error("Tenant not found");
};

export default discoverTenant;
