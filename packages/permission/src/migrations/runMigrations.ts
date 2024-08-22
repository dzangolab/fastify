import { ApiConfig } from "@dzangolab/fastify-config";
import { Database } from "@dzangolab/fastify-slonik";

import createPermissionsTableQuery from "./createPermissionsTableQuery";
import createRolePermissionsTableQuery from "./createRolePermissionsTableQuery";
import createRolesTableQuery from "./createRolesTableQuery";

const runMigrations = async (database: Database, config: ApiConfig) => {
  await database.connect(async (connection) => {
    await connection.query(createRolesTableQuery(config));
    await connection.query(createPermissionsTableQuery(config));
    await connection.query(createRolePermissionsTableQuery(config));
  });
};

export default runMigrations;
