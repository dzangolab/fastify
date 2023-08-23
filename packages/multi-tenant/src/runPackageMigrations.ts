import tenants from "./migrations/tenants";

import type { FastifyInstance } from "fastify";

const runPackageMigrations = async (fastify: FastifyInstance) => {
  await fastify.slonik.connect(async (connection) => {
    await connection.query(tenants(fastify.config));
  });
};

export default runPackageMigrations;
