import customQuery from "./customQuery";

import type { Database } from "./types";

const runCustomQuery = async (database: Database) => {
  await database.connect(async (connection) => {
    connection.query(customQuery);
  });
};

export default runCustomQuery;
