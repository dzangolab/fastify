import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import mailer from "../../../utils/sendEmail";

import type { FastifyInstance } from "fastify";

const sendEmail = (
  fastify: FastifyInstance
): typeof ThirdPartyEmailPassword.sendEmail => {
  const { config } = fastify;

  const websiteDomain = config.appOrigin[0] as string;
  const resetPasswordPath = "/reset-password";

  return async (input) => {
    await mailer({
      fastify,
      subject: "Reset Password",
      templateName: "reset-password",
      to: input.user.email,
      templateData: {
        passwordResetLink: input.passwordResetLink.replace(
          websiteDomain + "/auth/reset-password",
          websiteDomain +
            (config.user.supertokens.resetPasswordPath
              ? (config.user.supertokens.resetPasswordPath as string)
              : resetPasswordPath)
        ),
      },
    });
  };
};

export default sendEmail;
