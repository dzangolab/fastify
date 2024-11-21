import queryToCreateTable from "./queryToCreateTable";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const runMigrations = async (database: Database, config: ApiConfig) => {
  await database.connect(async (connection) => {
    await connection.query(queryToCreateTable(config));
  });
};

export default runMigrations;
