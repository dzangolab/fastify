import { existsSync } from "node:fs";

import { migrate } from "@dzangolab/postgres-migrations";
import * as pg from "pg";

import changeSchema from "./changeSchema";
import initializePgPool from "./initializePgPool";

import type { Tenant } from "../types";
import type { MigrateDBConfig } from "@dzangolab/postgres-migrations";

const runMigrations = async (
  migrateConfig: MigrateDBConfig,
  migrationsPath: string,
  tenant?: Tenant
) => {
  if (!existsSync(migrationsPath)) {
    return false;
  }

  const client =
    "client" in migrateConfig
      ? (migrateConfig.client as pg.Client)
      : // DU [2023-JAN-06] This smells
        await initializePgPool(migrateConfig);

  if (tenant?.schema) {
    await changeSchema(client, tenant.schema);
  }

  await migrate({ client }, migrationsPath);

  if (!("client" in migrateConfig)) {
    await client.end();
  }

  return true;
};

export default runMigrations;
