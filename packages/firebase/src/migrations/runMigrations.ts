import queryToCreateTable from "./queryToCreateTable";

import type { FirebaseOptions } from "../types";
import type { Database } from "@dzangolab/fastify-slonik";

const runMigrations = async (
  database: Database,
  firebaseOptions: FirebaseOptions,
) => {
  await database.connect(async (connection) => {
    await connection.query(queryToCreateTable(firebaseOptions));
  });
};

export default runMigrations;
