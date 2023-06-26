import { sql } from "slonik";

import queryToTriggerUpdatedAt from "./queryToTriggerUpdatedAt";

import type { FastifyInstance } from "fastify";

const runCustomMigrations = async (fastify: FastifyInstance) => {
  const { config, slonik } = fastify;

  await slonik.connect(async (connection) => {
    await connection.query(queryToTriggerUpdatedAt);
  });

  const customMigrations = config.slonik.migrations?.customMigrations;

  if (customMigrations) {
    for (const query of customMigrations) {
      await slonik.connect(async (connection) => {
        await connection.query(sql.unsafe([query]));
      });
    }
  }
};

export default runCustomMigrations;
