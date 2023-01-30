import FastifyPlugin from "fastify-plugin";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";

import router from "./router";

import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import type { MailOptions } from "nodemailer/lib/sendmail-transport";

const plugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const { config } = fastify;

  const {
    defaults,
    templating,
    test,
    transport,
    templateData: configTemplateData,
  } = config.mailer;

  const mailer = createTransport(transport, defaults);

  mailer.use(
    "compile",
    nodemailerMjmlPlugin({
      templateFolder: templating.templateFolder,
    })
  );

  mailer.use("compile", htmlToText());

  if (fastify.mailer) {
    throw new Error("fastify-mailer has already been registered");
  } else {
    fastify.decorate("mailer", {
      ...mailer,
      sendMail: async (
        userOptions: MailOptions,
        callback?: (
          err: Error | null,
          info: SMTPTransport.SentMessageInfo
        ) => void
      ) => {
        let templateData = {};

        configTemplateData &&
          (templateData = { ...templateData, ...configTemplateData });

        userOptions.templateData &&
          (templateData = { ...templateData, ...userOptions.templateData });

        if (callback) {
          return mailer.sendMail(
            {
              ...userOptions,
              templateData: {
                ...templateData,
              },
            },
            callback
          );
        }

        return mailer.sendMail({
          ...userOptions,
          templateData: {
            ...templateData,
          },
        });
      },
    });
  }

  if (test && test?.enabled) {
    const { path, to } = test;

    fastify.register(router, { path, to });
  }
};

export default FastifyPlugin(plugin);
