import emailVerification from "supertokens-node/recipe/emailverification";

import {
  DEFAULT_WEBSITE_BASE_PATH,
  EMAIL_VERIFICATION_PATH,
} from "../../../../constants";
import getOrigin from "../../../../lib/getOrigin";
import sendEmail from "../../../../lib/sendEmail";

import type { FastifyInstance, FastifyRequest } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailVerificationEmailDeliveryInput } from "supertokens-node/recipe/emailverification/types";

const sendEmailVerificationEmail = (
  originalImplementation: EmailDeliveryInterface<TypeEmailVerificationEmailDeliveryInput>,
  fastify: FastifyInstance,
): typeof emailVerification.sendEmail => {
  const config = fastify.config;

  const websiteDomain = config.appOrigin[0] as string;

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
      websiteDomain +
        `${config.user.supertokens.websiteBasePath ?? DEFAULT_WEBSITE_BASE_PATH}/verify-email`,
      origin +
        (config.user.supertokens.emailVerificationPath ||
          EMAIL_VERIFICATION_PATH),
    );

    sendEmail({
      fastify,
      subject: "Email Verification",
      templateName: "email-verification",
      to: input.user.email,
      templateData: {
        emailVerifyLink,
      },
    });
  };
};

export default sendEmailVerificationEmail;
