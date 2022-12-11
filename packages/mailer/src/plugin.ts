import fastifyMailer from "fastify-mailer";
import FastifyPlugin from "fastify-plugin";

import type { MailerConfig } from "./types";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";

const plugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const config: MailerConfig = fastify.config.mailer;

  fastify.register(fastifyMailer as FastifyPluginAsync, config);
};

export default FastifyPlugin(plugin);
