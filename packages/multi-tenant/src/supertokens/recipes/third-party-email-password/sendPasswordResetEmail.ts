import {
  DEFAULT_WEBSITE_BASE_PATH,
  RESET_PASSWORD_PATH,
  getOrigin,
  sendEmail,
} from "@dzangolab/fastify-user";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import Email from "../../utils/email";

import type { AppConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailPasswordPasswordResetEmailDeliveryInput } from "supertokens-node/lib/build/recipe/emailpassword/types";

const sendPasswordResetEmail = (
  originalImplementation: EmailDeliveryInterface<TypeEmailPasswordPasswordResetEmailDeliveryInput>,
  fastify: FastifyInstance,
): typeof ThirdPartyEmailPassword.sendEmail => {
  const config = fastify.config;

  const websiteDomain = config.appOrigin[0] as string;

  return async (input) => {
    const request: FastifyRequest<{
      Querystring: { appId: string | undefined };
    }> = input.userContext._default.request.request;

    let app: AppConfig | undefined;

    if (request.query.appId) {
      const appId = Number(request.query.appId);

      app = config.apps?.find((app) => app.id === appId);
    }

    const url =
      app?.origin ||
      request.headers.referer ||
      request.headers.origin ||
      request.hostname;

    const origin = getOrigin(url) || websiteDomain;

    const passwordResetLink = input.passwordResetLink.replace(
      websiteDomain +
        `${config.user.supertokens.websiteBasePath || DEFAULT_WEBSITE_BASE_PATH}/reset-password`,
      origin +
        (config.user.supertokens.resetPasswordPath || RESET_PASSWORD_PATH),
    );

    sendEmail({
      fastify,
      subject: "Reset Password",
      templateName: "reset-password",
      to: Email.removeTenantPrefix(
        request.config,
        input.user.email,
        input.userContext.tenant,
      ),
      templateData: {
        passwordResetLink,
      },
    });
  };
};

export default sendPasswordResetEmail;
