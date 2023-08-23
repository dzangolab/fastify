import { sql } from "slonik";

import { ROLE_ADMIN, ROLE_USER } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";

const users = (config: ApiConfig) => {
  return sql.unsafe`
    INSERT INTO "st__roles" ("role") VALUES 
    (${ROLE_ADMIN}),
    (${config.user.role || ROLE_USER})
    ON CONFLICT DO NOTHING;
  `;
};

export default users;
