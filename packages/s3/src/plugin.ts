import fastifyMultiPart from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";

import runMigrations from "./migrations/runMigrations";
import mercuriusGQLUpload from "./plugins/mercuriusUpload";
import multipartParser from "./plugins/multipartParser";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-s3 plugin");

  const { config, slonik } = fastify;

  await runMigrations(slonik, config);

  if (config.rest.enabled) {
    await fastify.register(fastifyMultiPart, {
      addToBody: true,
      sharedSchemaId: "fileSchema",
      limits: {
        fileSize: config.s3.fileSizeLimitInBytes || Number.POSITIVE_INFINITY,
      },
    });
  }

  if (config.mercurius.enabled) {
    await fastify.register(mercuriusGQLUpload, {
      maxFileSize: config.s3.fileSizeLimitInBytes || Number.POSITIVE_INFINITY,
    });
  }

  await fastify.register(multipartParser);

  done();
};

export default FastifyPlugin(plugin);
