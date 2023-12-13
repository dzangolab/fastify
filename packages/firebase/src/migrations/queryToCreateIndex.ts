import { ApiConfig } from "@dzangolab/fastify-config";
import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_USER_DEVICES } from "../constants";

const queryToCreateIndex = (config: ApiConfig): QuerySqlToken<ZodTypeAny> => {
  const tableName =
    config.firebase?.table?.userDevices?.name || TABLE_USER_DEVICES;

  return sql.unsafe`
    CREATE INDEX IF NOT EXISTS idx_user_id_device_token ON ${sql.identifier([
      tableName,
    ])} (user_id, device_token);
  `;
};

export default queryToCreateIndex;
