import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";

import runPackageMigrations from "./migrations/runPackageMigrations";
import { s3Client as S3Client } from "./utils/s3Client";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-s3 plugin");

  const s3Client = new S3Client(fastify.config);

  await runPackageMigrations(fastify.slonik, fastify.config);

  // register s3client
  fastify.decorate("s3Client", s3Client);

  done();
};

export default FastifyPlugin(plugin);
