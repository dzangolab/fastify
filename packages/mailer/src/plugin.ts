import fastifyMailer from "fastify-mailer";
import FastifyPlugin from "fastify-plugin";

import router from "./router";

import type { MailerConfig } from "./types";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";

const plugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const config: MailerConfig = fastify.config.mailer;

  fastify.register(fastifyMailer as FastifyPluginAsync, config);

  if (config?.test?.enabled) {
    const { path, to } = config.test;

    fastify.register(router, { path, to });
  }
};

export default FastifyPlugin(plugin);
