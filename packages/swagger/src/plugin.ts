import fastifySwagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import FastifyPlugin from "fastify-plugin";

import type { SwaggerOptions } from "./types";
import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance, options: SwaggerOptions) => {
  const { fastifySwaggerOptions, uiOptions } = options;

  if (options.enabled === false) {
    fastify.log.info("Swagger plugin is not enabled");

    return;
  }

  await fastify.register(fastifySwagger, fastifySwaggerOptions);

  await fastify.register(swaggerUi, uiOptions ?? {});

  fastify.decorate(
    "apiDocumentationPath",
    uiOptions?.routePrefix ?? "/documentation",
  );
};

export default FastifyPlugin(plugin);
