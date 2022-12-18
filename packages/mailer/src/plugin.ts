import fastifyMailer from "fastify-mailer";
import FastifyPlugin from "fastify-plugin";
import { htmlToText } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";

import router from "./router";

import type { FastifyInstance, FastifyPluginAsync } from "fastify";

const plugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const { config } = fastify;

  fastify.register(fastifyMailer as FastifyPluginAsync, config.mailer);

  const { mailer } = fastify;

  mailer.use(
    "compile",
    nodemailerMjmlPlugin({
      templateFolder: config.mailer.templating.templateFolder,
    })
  );

  mailer.use(`compile`, htmlToText());

  if (config.mailer?.test?.enabled) {
    const { path, to } = config.mailer.test;

    fastify.register(router, { path, to });
  }
};

export default FastifyPlugin(plugin);
