import { migrate, MigrateDBConfig } from "@dzangolab/postgres-migrations";
import * as pg from "pg";

import changeSchema from "./changeSchema";
import initializePgPool from "./initializePgPool";

const runMigrations = async (
  migrateConfig: MigrateDBConfig,
  migrationsDirectory: string,
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

  await migrate({ client }, migrationsDirectory);

  if (!("client" in migrateConfig)) {
    await client.end();
  }
};

export default runMigrations;
