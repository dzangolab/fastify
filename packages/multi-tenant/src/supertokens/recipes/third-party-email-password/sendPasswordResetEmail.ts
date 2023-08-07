import { getOrigin, sendEmail } from "@dzangolab/fastify-user";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import Email from "../../utils/email";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailPasswordPasswordResetEmailDeliveryInput } from "supertokens-node/lib/build/recipe/emailpassword/types";

const sendPasswordResetEmail = (
  originalImplementation: EmailDeliveryInterface<TypeEmailPasswordPasswordResetEmailDeliveryInput>,
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
        (fastify.config.user.supertokens.resetPasswordPath || resetPasswordPath)
    );

    sendEmail({
      fastify,
      subject: "Reset Password",
      templateName: "reset-password",
      to: Email.removeTenantPrefix(input.user.email, input.userContext.tenant),
      templateData: {
        passwordResetLink,
      },
    });
  };
};

export default sendPasswordResetEmail;
