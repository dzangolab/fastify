import { Database } from "@dzangolab/fastify-slonik";

import queryToCreateTable from "./queryToCreateTable";

const runMigrations = async (database: Database) => {
  await database.connect(async (connection) => {
    await connection.query(queryToCreateTable());
  });
};

export default runMigrations;
