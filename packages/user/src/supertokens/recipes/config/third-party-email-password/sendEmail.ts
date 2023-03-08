import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import mailer from "../../../utils/sendEmail";
import updateEmail from "../../../utils/updateEmail";

import type { FastifyInstance, FastifyRequest } from "fastify";

const sendEmail = (
  fastify: FastifyInstance
): typeof ThirdPartyEmailPassword.sendEmail => {
  const websiteDomain = fastify.config.appOrigin[0] as string;
  const resetPasswordPath = "/reset-password";

  return async (input) => {
    const request: FastifyRequest = input.userContext._default.request.request;

    const origin = new URL(
      request.headers.referer || request.headers.origin || request.hostname
    ).origin;

    const passwordResetLink = input.passwordResetLink.replace(
      websiteDomain + "/auth/reset-password",
      (input.userContext.tenant ? origin : websiteDomain) +
        (fastify.config.user.supertokens.resetPasswordPath
          ? (fastify.config.user.supertokens.resetPasswordPath as string)
          : resetPasswordPath)
    );

    await mailer({
      fastify,
      subject: "Reset Password",
      templateName: "reset-password",
      to: updateEmail.removeTenantId(
        input.user.email,
        input.userContext.tenant
      ),
      templateData: {
        passwordResetLink,
      },
    });
  };
};

export default sendEmail;
