import { ApiConfig } from "@dzangolab/fastify-config";
import { QuerySqlToken, sql } from "slonik";
import { ZodTypeAny } from "zod";

import { TABLE_FILES } from "../constants";

const queryToCreateTable = (config: ApiConfig): QuerySqlToken<ZodTypeAny> => {
  const tableName = config.s3?.table?.name || TABLE_FILES;

  return sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([tableName])} (
        id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        original_file_name VARCHAR(255) NOT NULL,
        bucket VARCHAR(255) NOT NULL,
        description TEXT,
        key VARCHAR(255) NOT NULL,
        uploaded_by_id VARCHAR(255),
        uploaded_at TIMESTAMP,
        download_count INT DEFAULT 0,
        last_downloaded_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
    );
`;
};

export default queryToCreateTable;