import { existsSync } from "node:fs";

import { migrate } from "@dzangolab/postgres-migrations";
import * as pg from "pg";

import changeSchema from "./changeSchema";
import initializePgPool from "./initializePgPool";

import type { Tenant } from "../types";
import type { ClientConfig } from "pg";

const runMigrations = async (
  migrateConfig:
    | ClientConfig
    | {
        readonly client: pg.Client | pg.PoolClient | pg.Pool;
      },
  migrationsPath: string,
  tenant: Tenant
) => {
  if (!existsSync(migrationsPath)) {
    return false;
  }

  const client =
    "client" in migrateConfig
      ? (migrateConfig.client as pg.Client)
      : // DU [2023-JAN-06] This smells
        await initializePgPool(migrateConfig);

  await changeSchema(client, tenant.slug);

  await migrate({ client }, migrationsPath);

  if (!("client" in migrateConfig)) {
    await client.end();
  }

  return true;
};

export default runMigrations;
