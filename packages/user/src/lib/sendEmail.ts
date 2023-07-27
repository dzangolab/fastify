import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyMailer } from "@dzangolab/fastify-mailer";
import type { FastifyBaseLogger } from "fastify";

const sendEmail = async ({
  config,
  log,
  mailer,
  subject,
  templateData = {},
  templateName,
  to,
}: {
  config: ApiConfig;
  log: FastifyBaseLogger;
  mailer: FastifyMailer;
  subject: string;
  templateData?: Record<string, string>;
  templateName: string;
  to: string;
}) => {
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
