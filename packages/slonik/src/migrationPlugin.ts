import FastifyPlugin from "fastify-plugin";

import migrate from "./migrate";

import type { FastifyInstance } from "fastify";

const migrationPlugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.log.info("Running database migrations");

  await migrate(fastify.config);

  done();
};

export default FastifyPlugin(migrationPlugin);
