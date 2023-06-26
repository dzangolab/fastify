import { sql } from "slonik";

import queryToTriggerUpdatedAt from "./queryToTriggerUpdatedAt";

import type { FastifyInstance } from "fastify";

const runPackageMigrations = async (fastify: FastifyInstance) => {
  const { config, slonik } = fastify;

  await slonik.connect(async (connection) => {
    await connection.query(queryToTriggerUpdatedAt);
  });

  const packageMigrations = config.slonik.migrations?.packageMigrations;

  if (packageMigrations) {
    for (const query of packageMigrations) {
      await slonik.connect(async (connection) => {
        await connection.query(sql.unsafe([query]));
      });
    }
  }
};

export default runPackageMigrations;
