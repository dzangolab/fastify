import "@dzangolab/fastify-mailer";

import type { FastifyInstance } from "fastify";

const sendEmail = async ({
  fastify,
  subject,
  templateData = {},
  templateName,
  to,
}: {
  fastify: FastifyInstance;
  subject: string;
  templateData?: Record<string, string>;
  templateName: string;
  to: string;
}) => {
  const { config, mailer, log } = fastify;

  return mailer
    .sendMail({
      subject: subject,
      templateName: templateName,
      to: to,
      templateData: {
        appName: config.appName,
        ...templateData,
      },
    })
    .catch((error: Error) => {
      log.error(error.stack);

      throw {
        name: "SEND_EMAIL",
        message: error.message,
        statusCode: 500,
      };
    });
};

export default sendEmail;
