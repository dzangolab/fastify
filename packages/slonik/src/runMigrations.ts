import * as pg from "pg";
import { migrate } from "postgres-migrations";

import changeSchema from "./utils/changeSchema";
import getMigrateDatabaseConfig from "./utils/getMigrateDatabaseConfig";

import type { ApiConfig } from "@dzangolab/fastify-config";

const runMigrations = async (
  config: ApiConfig,
  path: string,
  schema?: string
) => {
  const dbConfig = getMigrateDatabaseConfig(config);

  const client = new pg.Client(dbConfig as pg.ClientConfig);
  await client.connect();

  if (schema) {
    changeSchema(client, schema);
  }

  await migrate({ client }, path);

  await client.end();
};

export default runMigrations;
