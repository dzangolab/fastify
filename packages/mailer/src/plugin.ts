import FastifyPlugin from "fastify-plugin";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin } from "nodemailer-mjml";

import router from "./router";
import updateContext from "./updateContext";

import type { FastifyMailer } from "./types";
import type { MercuriusEnabledPlugin } from "@dzangolab/fastify-mercurius";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
} from "fastify";
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

  const transporter = createTransport(transport, defaults);

  transporter.use(
    "compile",
    nodemailerMjmlPlugin({
      templateFolder: templating.templateFolder,
    })
  );

  transporter.use("compile", htmlToText());

  const mailer = {
    ...transporter,
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

      const mailerOptions = {
        ...userOptions,
        templateData: {
          ...templateData,
        },
      };

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
    fastify.addHook("onRequest", async (request: FastifyRequest) => {
      request.mailer = mailer;
    });
  }

  if (test && test?.enabled) {
    const { path, to } = test;

    fastify.register(router, { path, to });
  }
};

const fastifyPlugin = FastifyPlugin(plugin) as MercuriusEnabledPlugin;

fastifyPlugin.updateContext = updateContext;

export default fastifyPlugin;
