import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_ORGANIZATIONS, TABLE_ORGANIZATION_OWNERS } from "../constants";

const addOrganizationAndOwnersRelationQuery = (): QuerySqlToken<ZodTypeAny> => {
  return sql.unsafe`
    DO $$
    BEGIN
      ALTER TABLE  ${sql.identifier([TABLE_ORGANIZATION_OWNERS])}
      ADD CONSTRAINT "organization_owners_organization_id_foreign_key"
      FOREIGN KEY ("organization_id") REFERENCES 
        ${sql.identifier([TABLE_ORGANIZATIONS])} ("id")
      ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN NULL; 
    END $$;
  `;
};

export default addOrganizationAndOwnersRelationQuery;
