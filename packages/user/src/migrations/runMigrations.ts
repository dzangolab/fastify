import { Database } from "@dzangolab/fastify-slonik";

import createOrganizationsQuery from "./createOrganizationsQuery";

const runMigrations = async (database: Database) => {
  await database.connect(async (connection) => {
    await connection.query(createOrganizationsQuery());
  });
};

export default runMigrations;
