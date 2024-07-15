import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_ORGANIZATIONS, TABLE_ORGANIZATION_OWNERS } from "../constants";

const addOrganizationAndOwnersRelationQuery = (): QuerySqlToken<ZodTypeAny> => {
  return sql.unsafe`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name  = ${TABLE_ORGANIZATION_OWNERS}
        AND constraint_name = 'organization_owners_organization_id_fkey'
      ) THEN
        ALTER TABLE  ${sql.identifier([
          TABLE_ORGANIZATION_OWNERS,
        ])} ADD CONSTRAINT
          "organization_owners_organization_id_fkey" FOREIGN KEY
          ("organization_id") REFERENCES  ${sql.identifier([
            TABLE_ORGANIZATIONS,
          ])} ("id");
      END IF;
    END $$;
  `;
};

export default addOrganizationAndOwnersRelationQuery;
