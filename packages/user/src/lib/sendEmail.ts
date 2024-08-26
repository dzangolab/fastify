// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FastifyMailer } from "@dzangolab/fastify-mailer";
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
  const { config, log, mailer } = fastify;

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
    });
};

export default sendEmail;
