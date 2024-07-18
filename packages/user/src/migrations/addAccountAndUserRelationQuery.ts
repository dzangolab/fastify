import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_ACCOUNTS, TABLE_ACCOUNT_USERS } from "../constants";

const addAccountAndUserRelationQuery = (): QuerySqlToken<ZodTypeAny> => {
  return sql.unsafe`
    DO $$
    BEGIN
      ALTER TABLE ${sql.identifier([TABLE_ACCOUNT_USERS])}
      ADD CONSTRAINT "account_users_account_id_foreign_key"
      FOREIGN KEY ("account_id") REFERENCES 
        ${sql.identifier([TABLE_ACCOUNTS])} ("id")
      ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN NULL; 
    END $$;
  `;
};

export default addAccountAndUserRelationQuery;
