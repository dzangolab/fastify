import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";

import runPackageMigrations from "./migrations/runPackageMigrations";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-s3 plugin");

  await runPackageMigrations(fastify.slonik, fastify.config);

  done();
};

export default FastifyPlugin(plugin);
