import { createTableFragment, Database } from "@dzangolab/fastify-slonik";
import { DatabasePoolConnection, sql } from "slonik";

import getDomain from "./getDomain";
import getMultiTenantConfig from "./multiTenantConfig";

import type { MultiTenantEnabledConfig, Tenant } from "../types";

const discoverTenant = async (
  config: MultiTenantEnabledConfig,
  database: Database,
  url: string
) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const domain = getDomain(url);

  if (
    multiTenantConfig.reserved.slugs.some(
      (slug) => slug + "." + multiTenantConfig.rootDomain === domain
    )
  ) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (domain) {
    // [DU 2023-FEB-01] Use Tenant service
    const tenantQuery = sql<Tenant>`
      SELECT *
      FROM ${createTableFragment(multiTenantConfig.table.name)}
      WHERE ${sql.identifier([
        multiTenantConfig.table.columns.domain,
      ])} = ${domain};
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
