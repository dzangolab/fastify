import { ApiConfig } from "@dzangolab/fastify-config";
import { Database } from "@dzangolab/fastify-slonik";

import queryToCreateTable from "./queryToCreateTable";

const runPackageMigrations = async (database: Database, config: ApiConfig) => {
  await database.connect(async (connection) => {
    await connection.query(queryToCreateTable(config));
  });
};

export default runPackageMigrations;
