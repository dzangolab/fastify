import queryToTriggerUpdatedAt from "./queryToTriggerUpdatedAt";

import type { Database } from "../types";

const runPackageMigrations = async (database: Database) => {
  await database.connect(async (connection) => {
    await connection.query(queryToTriggerUpdatedAt);
  });
};

export default runPackageMigrations;
