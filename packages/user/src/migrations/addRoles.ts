import { sql } from "slonik";

import { ROLE_ADMIN, ROLE_USER } from "../constants";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { SqlFragment } from "slonik";

const users = (config: ApiConfig) => {
  const roles = config.user.supportedRoles;

  if (config.user.role && !roles?.includes(config.user.role)) {
    throw new Error("User role not present in supportedRole");
  }

  let rolesSqlFragment: SqlFragment = sql.fragment``;

  if (roles && roles.length > 0) {
    rolesSqlFragment = sql.fragment`, ${sql.join(
      roles.map((role) => sql.fragment`(${role})`),
      sql.fragment`, `
    )}`;
  }

  return sql.unsafe`
    INSERT INTO "st__roles" ("role") VALUES 
    (${ROLE_ADMIN}),
    (${config.user.role || ROLE_USER})
    ${rolesSqlFragment}
    ON CONFLICT DO NOTHING;
  `;
};

export default users;
