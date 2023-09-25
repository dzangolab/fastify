import FastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";

import buildContext from "./buildContext";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const config = fastify.config.mercurius;

  if (config?.enabled) {
    if (!fastify.hasContentTypeParser("multipart")) {
      fastify.addContentTypeParser("multipart", (req, _payload, done) => {
        if (
          config.enabled &&
          req.routerPath?.startsWith(config.path as string)
        ) {
          req.mercuriusUploadMultipart = true;

          // eslint-disable-next-line unicorn/no-null
          done(null);
        }
      });
    }

    // Register mercurius
    await fastify.register(mercurius, {
      context: buildContext,
      ...config,
    });
  } else {
    fastify.log.info("GraphQL API not enabled");
  }
};

export default FastifyPlugin(plugin);
