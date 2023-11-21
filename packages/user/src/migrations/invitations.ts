import { sql } from "slonik";

import { TABLE_INVITATIONS, TABLE_USERS } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";

const invitations = (config: ApiConfig) => {
  return sql.unsafe`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS ${sql.identifier([TABLE_INVITATIONS])} (
      id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      accepted_at TIMESTAMP,
      app_id INTEGER,
      email VARCHAR ( 256 ) NOT NULL,
      expires_at TIMESTAMP,
      invited_by_id VARCHAR ( 36 ) NOT NULL,
      payload JSONB,
      revoked_at TIMESTAMP,
      role VARCHAR ( 255 ) NOT NULL,
      token UUID DEFAULT uuid_generate_v4() UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY ( invited_by_id ) REFERENCES  ${sql.identifier([
        config.user.table?.name || TABLE_USERS,
      ])} ( id ),
      FOREIGN KEY ( role ) REFERENCES st__roles ( role )
    );
  `;
};

export default invitations;
