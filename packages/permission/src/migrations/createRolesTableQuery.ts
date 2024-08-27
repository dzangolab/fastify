import { ApiConfig } from "@dzangolab/fastify-config";
import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_ROLES } from "../constants";

const createRolesTableQuery = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: ApiConfig
): QuerySqlToken<ZodTypeAny> => {
  const tableName = TABLE_ROLES;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([tableName])} (
      id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      key VARCHAR( 255 ) UNIQUE NOT NULL,
      name VARCHAR( 255 ) UNIQUE NOT NULL,
      "default" BOOLEAN DEFAULT FALSE,
      description TEXT
    );
`;
};

export default createRolesTableQuery;
