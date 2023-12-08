import { ApiConfig } from "@dzangolab/fastify-config";
import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_PERMISSIONS } from "../constants";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const queryToCreateTable = (config: ApiConfig): QuerySqlToken<ZodTypeAny> => {
  const tableName = TABLE_PERMISSIONS;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([tableName])} (
        id character varying(255) NOT NULL
    );
`;
};

export default queryToCreateTable;
