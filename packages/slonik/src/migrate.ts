import { migrate as runMigrations } from "@dzangolab/postgres-migrations";
import * as pg from "pg";

import type { SlonikConfig } from "./types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { ClientConfig } from "pg";

const migrate = async (config: ApiConfig) => {
  const slonikConfig = config.slonik as SlonikConfig;

  const defaultMigrationsPath = "migrations";

  let clientConfig: ClientConfig = {
    database: slonikConfig.db.databaseName,
    user: slonikConfig.db.username,
    password: slonikConfig.db.password,
    host: slonikConfig.db.host,
    port: slonikConfig.db.port,
  };

  if (slonikConfig.clientConfiguration?.ssl) {
    clientConfig = {
      ...clientConfig,
      ssl: slonikConfig.clientConfiguration?.ssl,
    };
  }

  const client = new pg.Client(clientConfig);

  try {
    await client.connect();
    await runMigrations(
      { client: client },
      slonikConfig?.migrations?.path || defaultMigrationsPath
    );
  } catch {
    await client.end();
  }
};

export default migrate;
