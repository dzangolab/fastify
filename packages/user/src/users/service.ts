import {
  createTableFragment,
  createLimitFragment,
  createWhereIdFragment,
} from "@dzangolab/fastify-slonik";

import type { User } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { SqlTaggedTemplate } from "slonik";

const tableName = "users";

const Service = (
  config: ApiConfig,
  database: Database,
  sql: SqlTaggedTemplate
) => {
  return {
    findById: async (id: string): Promise<User | null> => {
      const query = sql<User>`
        SELECT *
        FROM ${createTableFragment(tableName)}
        ${createWhereIdFragment(id)}
      `;

      const result = await database.connect((connection) => {
        return connection.maybeOne(query);
      });

      return result;
    },

    list: async (
      limit: number | undefined = config.pagination.default_limit,
      offset?: number
    ): Promise<readonly User[]> => {
      const query = sql<User>`
        SELECT *
        FROM ${createTableFragment(tableName)}
        ORDER BY id ASC
        ${createLimitFragment(
          Math.min(
            limit ?? config.pagination.default_limit,
            config?.pagination.max_limit
          ),
          offset
        )};
      `;

      const result = await database.connect((connection) => {
        return connection.any(query);
      });

      return result;
    },
  };
};

export default Service;
