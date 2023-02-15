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
  const { config } = fastify;

  init(fastify);

  fastify.setErrorHandler(errorHandler());

  fastify.register(cors, {
    origin: config.appOrigin,
    allowedHeaders: ["Content-Type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  // Register plugins for supertokens
  fastify.register(formDataPlugin);
  fastify.register(supertokensPlugin);

  fastify.decorate("verifySession", verifySession);

  done();
};

export default FastifyPlugin(plugin);
