import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";

import runMigrations from "./migrations/runMigrations";
import { s3Client as S3Client } from "./utils/s3Client";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-s3 plugin");

  const { config, slonik } = fastify;

  const s3Client = new S3Client(config);

  // register s3client
  fastify.decorate("s3Client", s3Client);

  await runMigrations(slonik, config);

  done();
};

export default FastifyPlugin(plugin);
