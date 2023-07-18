import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyMailer } from "@dzangolab/fastify-mailer";

const sendEmail = async ({
  config,
  mailer,
  subject,
  templateData = {},
  templateName,
  to,
}: {
  config: ApiConfig;
  mailer: FastifyMailer;
  subject: string;
  templateData?: Record<string, string>;
  templateName: string;
  to: string;
}) => {
  return mailer.sendMail({
    subject: subject,
    templateName: templateName,
    to: to,
    templateData: {
      appName: config.appName,
      ...templateData,
    },
  });
};

export default sendEmail;
