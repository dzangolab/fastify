import { Database } from "@dzangolab/fastify-slonik";

import addAccountAndUserRelationQuery from "./addAccountAndUserRelationQuery";
import addOrganizationAndOwnersRelationQuery from "./addOrganizationAndOwnersRelationQuery";
import createAccountsQuery from "./createAccountsQuery";
import createAccountUsersQuery from "./createAccountUsersQuery";
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

  await database.connect(async (connection) => {
    await connection.query(createAccountsQuery());
  });

  await database.connect(async (connection) => {
    await connection.query(createAccountUsersQuery());
  });

  await database.connect(async (connection) => {
    await connection.query(addAccountAndUserRelationQuery());
  });
};

export default runMigrations;
