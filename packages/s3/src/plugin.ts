import fastifyMultiPart from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";

import runMigrations from "./migrations/runMigrations";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-s3 plugin");

  const { config, slonik } = fastify;

  await runMigrations(slonik, config);

  await fastify.register(fastifyMultiPart, {
    addToBody: true,
    sharedSchemaId: "fileSchema",
    limits: {
      fileSize: Number.POSITIVE_INFINITY,
    },
  });

  done();
};

export default FastifyPlugin(plugin);
