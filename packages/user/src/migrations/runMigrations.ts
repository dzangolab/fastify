import { Database } from "@dzangolab/fastify-slonik";

import addOrganizationAndOwnersRelationQuery from "./addOrganizationAndOwnersRelationQuery";
import createOrganizationOwnersQuery from "./createOrganizationOwnersQuery";
import createOrganizationsQuery from "./createOrganizationsQuery";

const runMigrations = async (database: Database) => {
  await database.connect(async (connection) => {
    await connection.query(createOrganizationsQuery());
  });

  await database.connect(async (connection) => {
    await connection.query(createOrganizationOwnersQuery());
  });

  await database.connect(async (connection) => {
    await connection.query(addOrganizationAndOwnersRelationQuery());
  });
};

export default runMigrations;
