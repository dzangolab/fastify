import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import email from "../../../utils/email";
import getOrigin from "../../../utils/getOrigin";
import mailer from "../../../utils/sendEmail";

import type { FastifyInstance, FastifyRequest } from "fastify";

const sendEmail = (
  fastify: FastifyInstance
): typeof ThirdPartyEmailPassword.sendEmail => {
  const websiteDomain = fastify.config.appOrigin[0] as string;
  const resetPasswordPath = "/reset-password";

  return async (input) => {
    const request: FastifyRequest = input.userContext._default.request.request;

    const url =
      request.headers.referer || request.headers.origin || request.hostname;

    const origin = getOrigin(url) || websiteDomain;

    const passwordResetLink = input.passwordResetLink.replace(
      websiteDomain + "/auth/reset-password",
      origin +
        (fastify.config.user.supertokens.resetPasswordPath
          ? (fastify.config.user.supertokens.resetPasswordPath as string)
          : resetPasswordPath)
    );

    await mailer({
      fastify,
      subject: "Reset Password",
      templateName: "reset-password",
      to: email.removeTenantId(input.user.email, input.userContext.tenant),
      templateData: {
        passwordResetLink,
      },
    });
  };
};

export default sendEmail;
