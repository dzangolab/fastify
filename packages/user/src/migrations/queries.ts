import { sql } from "slonik";

import { TABLE_USERS } from "../../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QuerySqlToken } from "slonik";
import type { ZodTypeAny } from "zod";

const createUsersTableQuery = (
  config: ApiConfig,
): QuerySqlToken<ZodTypeAny> => {
  const users = config.user.table?.name || TABLE_USERS;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([users])} (
      id VARCHAR ( 36 ) PRIMARY KEY,
      disabled BOOLEAN NOT NULL DEFAULT false,
      email VARCHAR ( 256 ) NOT NULL,
      last_login_at TIMESTAMP NOT NULL DEFAULT NOW(),
      signed_up_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ( id ) REFERENCES st__all_auth_recipe_users ( user_id )
    );
  `;
};

export default createUsersTableQuery;
