import { sql } from "slonik";

import { TABLE_USER_DEVICES } from "../constants";

import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { QuerySqlToken } from "slonik";
import type { ZodTypeAny } from "zod";

const queryToCreateTable = (config: ApiConfig): QuerySqlToken<ZodTypeAny> => {
  const tableName =
    config.firebase.table?.userDevices?.name || TABLE_USER_DEVICES;

  return sql.unsafe`
    DO $$
    BEGIN
      CREATE TABLE IF NOT EXISTS ${sql.identifier([tableName])} (
        id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        device_token VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_user_id_device_token ON ${sql.identifier([
        tableName,
      ])} (user_id, device_token);
    END $$;
  `;
};

export default queryToCreateTable;
