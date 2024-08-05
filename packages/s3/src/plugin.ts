import fastifyMultiPart from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";

import runMigrations from "./migrations/runMigrations";
import mercuriusGQLUpload from "./plugins/mercuriusUpload";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  console.log("s3 graphql");

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

  console.log("before s3 graphql");
  if (config.graphql?.enabled) {
    await fastify.register(mercuriusGQLUpload, {
      maxFileSize: config.s3.fileSizeLimitInBytes || Number.POSITIVE_INFINITY,
    });
  }
  console.log("after s3 graphql");

  done();
};

export default FastifyPlugin(plugin);
