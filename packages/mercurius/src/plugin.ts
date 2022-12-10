import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";

import buildContext from "./buildContext";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const config = fastify.config.mercurius;

  if (config?.enabled) {
    // Register mercurius
    fastify.register(mercurius, {
      context: buildContext,
      ...config,
    });
  } else {
    fastify.log.info("GraphQL API not enabled");
  }
};

export default FastifyPlugin(plugin);
