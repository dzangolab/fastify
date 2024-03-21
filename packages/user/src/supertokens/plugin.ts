import cors from "@fastify/cors";
import formDataPlugin from "@fastify/formbody";
import FastifyPlugin from "fastify-plugin";
import supertokens from "supertokens-node";
import {
  errorHandler,
  plugin as supertokensPlugin,
} from "supertokens-node/framework/fastify";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

import init from "./init";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const { config, log } = fastify;

  log.info("Registering supertokens plugin");

  init(fastify);

  fastify.setErrorHandler(errorHandler());

  await fastify.register(cors, {
    origin: config.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...supertokens.getAllCORSHeaders(),
    ],
    credentials: true,
  });

  // Register plugins for supertokens
  await fastify.register(formDataPlugin);
  await fastify.register(supertokensPlugin);

  log.info("Registering supertokens plugin complete");

  fastify.decorate("verifySession", verifySession);

  done();
};

export default FastifyPlugin(plugin);
