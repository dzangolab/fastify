import type { Client } from "pg";

const changeSchema = async (client: Client, name: string) => {
  // Create schema if not exists and switch to the schema
  await client.query(
    `
      CREATE SCHEMA IF NOT EXISTS ${name};
      SET search_path TO ${name};
    `
  );
};

export default changeSchema;
