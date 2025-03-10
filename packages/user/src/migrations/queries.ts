import { sql } from "slonik";

import { TABLE_INVITATIONS, TABLE_USERS } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QuerySqlToken } from "slonik";
import type { ZodTypeAny } from "zod";

const createInvitationsTableQuery = (
  config: ApiConfig,
): QuerySqlToken<ZodTypeAny> => {
  const invitations =
    config.user.tables?.invitations?.name || TABLE_INVITATIONS;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([invitations])} (
      id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      accepted_at TIMESTAMP,
      app_id INTEGER,
      email VARCHAR ( 256 ) NOT NULL,
      expires_at TIMESTAMP,
      invited_by_id VARCHAR ( 36 ) NOT NULL,
      payload JSONB,
      revoked_at TIMESTAMP,
      role VARCHAR ( 255 ) NOT NULL,
      token UUID DEFAULT gen_random_uuid() UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ( invited_by_id ) REFERENCES  ${sql.identifier([
        config.user.tables?.users?.name || TABLE_USERS,
      ])} ( id ),
      FOREIGN KEY ( role ) REFERENCES st__roles ( role )
    );
  `;
};

const createUsersTableQuery = (
  config: ApiConfig,
): QuerySqlToken<ZodTypeAny> => {
  const users = config.user.tables?.users?.name || TABLE_USERS;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([users])} (
      id VARCHAR ( 36 ) PRIMARY KEY,
      disabled BOOLEAN NOT NULL DEFAULT false,
      email VARCHAR ( 256 ) NOT NULL,
      given_name VARCHAR ( 255 ),
      middle_names VARCHAR ( 255 ),
      surname VARCHAR ( 255 ),
      last_login_at TIMESTAMP NOT NULL DEFAULT NOW(),
      signed_up_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ( id ) REFERENCES st__all_auth_recipe_users ( user_id )
    );
  `;
};

export { createInvitationsTableQuery, createUsersTableQuery };
