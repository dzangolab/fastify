import type { SessionRequest } from "supertokens-node/framework/fastify";

const sendEmail = async ({
  request,
  subject,
  templateData = {},
  templateName,
  to,
}: {
  request: SessionRequest;
  subject: string;
  templateData?: Record<string, string>;
  templateName: string;
  to: string;
}) => {
  const { config, mailer, log } = request;

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
