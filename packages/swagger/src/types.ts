import type { SwaggerOptions as TSwaggerOptions } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

type SwaggerOptions = {
  enabled?: boolean;
  fastifySwaggerOptions: TSwaggerOptions;
  uiOptions?: FastifySwaggerUiOptions;
};

export type { SwaggerOptions };
