import * as pg from "pg";
import { migrate, MigrateDBConfig } from "postgres-migrations";

import changeSchema from "./utils/changeSchema";
import initializePgPool from "./utils/initializePgPool";

const runMigrations = async (
  migrateConfig: MigrateDBConfig,
  path: string,
  schema?: string
) => {
  const client =
    "client" in migrateConfig
      ? (migrateConfig.client as pg.Client)
      : // DU [2023-JAN-06] This smells
        await initializePgPool(migrateConfig);

  if (schema) {
    await changeSchema(client, schema);
  }

  await migrate({ client }, path);

  if (!("client" in migrateConfig)) {
    await client.end();
  }
};

export default runMigrations;
