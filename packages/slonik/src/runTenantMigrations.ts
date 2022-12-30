import { migrate as runMigrations } from "postgres-migrations";

import changeSchema from "./changeSchema";

import type { TenantInput } from "./types";
import type { Client } from "pg";

const runTenantMigrations = async (
  client: Client,
  path: string,
  tenant: TenantInput
) => {
  await changeSchema(client, tenant.slug);

  await runMigrations({ client }, path);
};

export default runTenantMigrations;
