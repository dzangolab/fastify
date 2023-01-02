import type { Client } from "pg";

const changeSchema = async (client: Client, name: string) => {
  // Create schema if not exists
  await client.query(`CREATE SCHEMA IF NOT EXISTS ${name};`);

  // Switch to the schema
  await client.query(`SET search_path TO ${name};`);
};

export default changeSchema;
