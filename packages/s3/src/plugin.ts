import fastifyMultiPart from "@fastify/multipart";
import FastifyPlugin from "fastify-plugin";

import runMigrations from "./migrations/runMigrations";
import graphqlGQLUpload from "./plugins/graphqlUpload";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void,
) => {
  fastify.log.info("Registering fastify-s3 plugin");

  const { config, slonik } = fastify;

  await runMigrations(slonik, config);

  if (config.rest.enabled) {
    await fastify.register(fastifyMultiPart, {
      attachFieldsToBody: "keyValues",
      sharedSchemaId: "fileSchema",
      limits: {
        fileSize: config.s3.fileSizeLimitInBytes || Number.POSITIVE_INFINITY,
      },
      async onFile(part) {
        // @ts-expect-error: data value and data is missing in MultipartFile type
        part.value = {
          filename: part.filename,
          mimetype: part.mimetype,
          encoding: part.encoding,
          data: await part.toBuffer(),
        };
      },
    });
  }

  if (config.graphql?.enabled) {
    await fastify.register(graphqlGQLUpload, {
      maxFileSize: config.s3.fileSizeLimitInBytes || Number.POSITIVE_INFINITY,
    });
  }

  done();
};

export default FastifyPlugin(plugin);
