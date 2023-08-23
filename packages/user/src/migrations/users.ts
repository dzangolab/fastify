import { sql } from "slonik";

import { TABLE_USERS } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";

const users = (config: ApiConfig) => sql.unsafe`
  CREATE TABLE IF NOT EXISTS ${sql.identifier([
    config.user.table?.name || TABLE_USERS,
  ])} (
    id VARCHAR ( 36 ) PRIMARY KEY,
    email VARCHAR ( 256 ) NOT NULL,
    last_login_at TIMESTAMP NOT NULL DEFAULT NOW(),
    signed_up_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ( id ) REFERENCES st__all_auth_recipe_users ( user_id )
  );
`;

export default users;
