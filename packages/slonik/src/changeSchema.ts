import { ApiConfig } from "@dzangolab/fastify-config";
import { sql } from "slonik";

import database from "./utils/database";

const changeSchema = async (name: string, config: ApiConfig) => {
  const db = await database(config);

  // Create schema if not exists
  const schema = sql`CREATE SCHEMA IF NOT EXISTS ${name};`;

  db.connect((connection) => {
    return connection.query(schema);
  });

  // Switch to the schema
  const query = sql`SET search_path TO ${name};`;

  db.connect((connection) => {
    return connection.query(query);
  });
};

export default changeSchema;
