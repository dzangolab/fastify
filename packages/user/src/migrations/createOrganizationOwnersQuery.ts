import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_ORGANIZATION_OWNERS } from "../constants";

const createOrganizationsQuery = (): QuerySqlToken<ZodTypeAny> => {
  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([TABLE_ORGANIZATION_OWNERS])} (
      "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      "organization_id" INTEGER,
      "owner_id" INTEGER
    );
  `;
};

export default createOrganizationsQuery;