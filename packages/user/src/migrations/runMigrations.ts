import { Database } from "@dzangolab/fastify-slonik";

import createAccountsQuery from "./createAccountsQuery";
import createOrganizationOwnersQuery from "./createOrganizationOwnersQuery";
import createOrganizationsQuery from "./createOrganizationsQuery";
import createOrganizationUsersQuery from "./createOrganizationUsersQuery";

const runMigrations = async (database: Database) => {
  await database.connect(async (connection) => {
    await connection.query(createOrganizationsQuery());
  });

  await database.connect(async (connection) => {
    await connection.query(createOrganizationOwnersQuery());
  });

  await database.connect(async (connection) => {
    await connection.query(createAccountsQuery());
  });

  await database.connect(async (connection) => {
    await connection.query(createOrganizationUsersQuery());
  });
};

export default runMigrations;
