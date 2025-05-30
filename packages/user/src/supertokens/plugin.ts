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

import type { FastifyError, FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const { config, log } = fastify;

  log.info("Registering supertokens plugin");

  init(fastify);

  // Explicitly cast the errorHandler to the correct type
  // [RL 2025-04-01] This should be fixed when supertokens-node is updated
  fastify.setErrorHandler(
    errorHandler() as unknown as (
      this: FastifyInstance,
      error: FastifyError,
      request: import("fastify").FastifyRequest,
      reply: import("fastify").FastifyReply,
    ) => void,
  );

  await fastify.register(cors, {
    origin: config.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...supertokens.getAllCORSHeaders(),
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  });

  // Register plugins for supertokens
  await fastify.register(formDataPlugin);
  await fastify.register(supertokensPlugin);

  log.info("Registering supertokens plugin complete");

  fastify.decorate("verifySession", verifySession);

  // [RL 2024-06-11] change sRefreshToken cookie path from config
  fastify.addHook("onSend", async (request, reply) => {
    const refreshTokenCookiePath =
      request.server.config.user.supertokens.refreshTokenCookiePath;

    const setCookieHeader = reply.getHeader("set-cookie");

    if (setCookieHeader && refreshTokenCookiePath) {
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      const updatedCookies = cookies.map((cookie) => {
        if (String(cookie).startsWith("sRefreshToken")) {
          return String(cookie).replace(
            // eslint-disable-next-line unicorn/better-regex
            /Path=\/[^;]*/i,
            `Path=${refreshTokenCookiePath}`,
          );
        }

        return cookie;
      });

      reply.removeHeader("set-cookie");
      reply.header("set-cookie", updatedCookies);
    }
  });
};

export default FastifyPlugin(plugin);
