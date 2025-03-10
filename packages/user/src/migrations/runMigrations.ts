import { createInvitationsTableQuery, createUsersTableQuery } from "./queries";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const runMigrations = async (config: ApiConfig, database: Database) => {
  await database.connect(async (connection) => {
    await connection.transaction(async (transactionConnection) => {
      await transactionConnection.query(createUsersTableQuery(config));
      await transactionConnection.query(createInvitationsTableQuery(config));
    });
  });
};

export default runMigrations;
