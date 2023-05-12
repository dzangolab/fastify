import updateAtTriggerQuery from "./updateAtTriggerQuery";

import type { Database } from "../types";

const runPackageMigrations = async (database: Database) => {
  await database.connect(async (connection) => {
    await connection.query(updateAtTriggerQuery);
  });
};

export default runPackageMigrations;
