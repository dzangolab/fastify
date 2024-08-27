import { ApiConfig } from "@dzangolab/fastify-config";
import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_ROLE_PERMISSIONS } from "../constants";

const createRolesTableQuery = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: ApiConfig
): QuerySqlToken<ZodTypeAny> => {
  const tableName = TABLE_ROLE_PERMISSIONS;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([tableName])} (
      role_id INTEGER NOT NULL,
      permission_id INTEGER NOT NULL,
      FOREIGN KEY ( role_id ) REFERENCES roles ( id ) ON DELETE CASCADE,
      FOREIGN KEY ( permission_id ) REFERENCES permissions ( id ) ON DELETE CASCADE,
      CONSTRAINT unique_role_permission_combination UNIQUE ( role_id, permission_id )
    );
`;
};

export default createRolesTableQuery;
