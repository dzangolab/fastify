import FastifyPlugin from "fastify-plugin";

import type { ApiConfig } from "./types";
import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyRequest,
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault
} from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: { config: ApiConfig },
  done: () => void
) => {
  const config = options.config;

  // Decorate api and request with `config`
  fastify.decorate("config", config);
  fastify.addHook("onRequest", async (request: FastifyRequest) => {
    request.config = config;
  });

  const { baseUrl, port } = config;
  const host = `${baseUrl}:${port}`;
  fastify.decorate("hostname", host);

  done();
};

declare module "fastify" {
  interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    Logger extends FastifyBaseLogger = FastifyBaseLogger,
    TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault
  > {
    config: ApiConfig;
    hostname: string;
  }

  interface FastifyRequest {
    config: ApiConfig;
  }
}

export default FastifyPlugin(plugin);

export * from "./types";
