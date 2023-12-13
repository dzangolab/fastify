import { ApiConfig } from "@dzangolab/fastify-config";
import { Database } from "@dzangolab/fastify-slonik";

import queryToCreateIndex from "./queryToCreateIndex";
import queryToCreateTable from "./queryToCreateTable";

const runMigrations = async (database: Database, config: ApiConfig) => {
  await database.connect(async (connection) => {
    await connection.query(queryToCreateTable(config));
    await connection.query(queryToCreateIndex(config));
  });
};

export default runMigrations;
