import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import { RESET_PASSWORD_PATH } from "../../../../constants";
import getOrigin from "../../../../lib/getOrigin";
import sendEmail from "../../../../lib/sendEmail";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailPasswordPasswordResetEmailDeliveryInput } from "supertokens-node/lib/build/recipe/emailpassword/types";

const sendPasswordResetEmail = (
  originalImplementation: EmailDeliveryInterface<TypeEmailPasswordPasswordResetEmailDeliveryInput>,
  fastify: FastifyInstance
): typeof ThirdPartyEmailPassword.sendEmail => {
  const websiteDomain = fastify.config.appOrigin[0] as string;

  return async (input) => {
    const request: FastifyRequest<{
      Querystring: { appId: string | undefined };
    }> = input.userContext._default.request.request;

    const appId = Number(request.query.appId);

    const app = fastify.config.apps?.find((app) => app.id === appId);

    const url =
      app?.origin ||
      request.headers.referer ||
      request.headers.origin ||
      request.hostname;

    const origin = getOrigin(url) || websiteDomain;

    const passwordResetLink = input.passwordResetLink.replace(
      websiteDomain + "/auth/reset-password",
      origin +
        (fastify.config.user.supertokens.resetPasswordPath ||
          RESET_PASSWORD_PATH)
    );

    sendEmail({
      fastify,
      subject: "Reset Password",
      templateName: "reset-password",
      to: input.user.email,
      templateData: {
        passwordResetLink,
      },
    });
  };
};

export default sendPasswordResetEmail;
