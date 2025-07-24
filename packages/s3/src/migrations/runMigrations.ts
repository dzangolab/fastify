import queryToCreateTable from "./queryToCreateTable";

import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

const runMigrations = async (database: Database, config: ApiConfig) => {
  await database.connect(async (connection) => {
    await connection.query(queryToCreateTable(config));
  });
};

export default runMigrations;
