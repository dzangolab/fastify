import { sql } from "slonik";

import getMultiTenantConfig from "../lib/getMultiTenantConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";

const tenants = (config: ApiConfig) => {
  const multiTenantConfig = getMultiTenantConfig(config);

  const { id, domain, name, slug } = multiTenantConfig.table.columns;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([
      multiTenantConfig.table.name,
    ])} (
    ${sql.identifier([id])} SERIAL PRIMARY KEY,
    ${sql.identifier([name])} name VARCHAR ( 255 ),
    ${sql.identifier([slug])} slug VARCHAR ( 63 ) NOT NULL UNIQUE,
    ${sql.identifier([domain])} domain VARCHAR ( 255 ),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
};

export default tenants;
