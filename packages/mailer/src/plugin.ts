import FastifyPlugin from "fastify-plugin";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";

import router from "./router";

import type { FastifyMailer } from "./types";
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
    recipients,
  } = config.mailer;

  const transporter = createTransport(transport, defaults);

  transporter.use(
    "compile",
    nodemailerMjmlPlugin({
      templateFolder: templating.templateFolder,
    }),
  );

  transporter.use("compile", htmlToText());

  const mailer = {
    ...transporter,
    sendMail: async (
      userOptions: MailOptions,
      callback?: (
        err: Error | null,
        info: SMTPTransport.SentMessageInfo,
      ) => void,
    ) => {
      let templateData = {};

      configTemplateData &&
        (templateData = { ...templateData, ...configTemplateData });

      userOptions.templateData &&
        (templateData = { ...templateData, ...userOptions.templateData });

      let mailerOptions = {
        ...userOptions,
        templateData: {
          ...templateData,
        },
      };

      if (recipients && recipients.length > 0) {
        mailerOptions = {
          ...mailerOptions,
          bcc: undefined,
          cc: undefined,
          to: recipients,
        };
      }

      if (callback) {
        return transporter.sendMail(mailerOptions, callback);
      }

      return transporter.sendMail(mailerOptions);
    },
  } as FastifyMailer;

  if (fastify.mailer) {
    throw new Error("fastify-mailer has already been registered");
  } else {
    fastify.decorate("mailer", mailer);
  }

  if (test && test?.enabled) {
    const { path, to } = test;

    await fastify.register(router, { path, to });
  }
};

export default FastifyPlugin(plugin);
