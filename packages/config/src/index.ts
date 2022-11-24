import FastifyPlugin from "fastify-plugin";

import type { ApiConfig } from "./types";
import type { FastifyInstance, FastifyRequest } from "fastify";

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
  interface FastifyInstance {
    config: ApiConfig;
    hostname: string;
  }

  interface FastifyRequest {
    config: ApiConfig;
  }
}

export default FastifyPlugin(plugin);

export * from "./types";
