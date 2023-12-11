import {
  EMAIL_VERIFICATION_PATH,
  getOrigin,
  sendEmail,
} from "@dzangolab/fastify-user";
import emailVerification from "supertokens-node/recipe/emailverification";

import Email from "../../utils/email";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailVerificationEmailDeliveryInput } from "supertokens-node/recipe/emailverification/types";

const sendEmailVerificationEmail = (
  originalImplementation: EmailDeliveryInterface<TypeEmailVerificationEmailDeliveryInput>,
  fastify: FastifyInstance
): typeof emailVerification.sendEmail => {
  const websiteDomain = fastify.config.appOrigin[0] as string;

  return async (input) => {
    let origin: string;

    try {
      const request: FastifyRequest =
        input.userContext._default.request.request;

      const url =
        request.headers.referer || request.headers.origin || request.hostname;

      origin = getOrigin(url) || websiteDomain;
    } catch {
      origin = websiteDomain;
    }

    const emailVerifyLink = input.emailVerifyLink.replace(
      websiteDomain + "/auth/verify-email",
      origin +
        (fastify.config.user.supertokens.emailVerificationPath ||
          EMAIL_VERIFICATION_PATH)
    );

    let email = input.user.email;

    if (input.userContext._default.request.original.tenant) {
      email = Email.removeTenantPrefix(
        email,
        input.userContext._default.request.original.tenant
      );
    }

    sendEmail({
      fastify,
      subject: "Email Verification",
      templateName: "email-verification",
      to: email,
      templateData: {
        emailVerifyLink,
      },
    });
  };
};

export default sendEmailVerificationEmail;
