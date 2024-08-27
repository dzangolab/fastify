import { ApiConfig } from "@dzangolab/fastify-config";
import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_PERMISSIONS } from "../constants";

const createPermissionsTableQuery = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: ApiConfig
): QuerySqlToken<ZodTypeAny> => {
  const tableName = TABLE_PERMISSIONS;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([tableName])} (
      id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name VARCHAR( 255 ) UNIQUE NOT NULL,
      description TEXT
    );
`;
};

export default createPermissionsTableQuery;
