import emailVerification from "supertokens-node/recipe/emailverification";

import sendEmail from "../../../../lib/sendEmail";

import type { FastifyInstance } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailVerificationEmailDeliveryInput } from "supertokens-node/recipe/emailverification/types";

const sendEmailVerificationEmail = (
  originalImplementation: EmailDeliveryInterface<TypeEmailVerificationEmailDeliveryInput>,
  fastify: FastifyInstance
): typeof emailVerification.sendEmail => {
  return async (input) => {
    sendEmail({
      fastify,
      subject: "Email Verification",
      templateName: "email-verification",
      to: input.user.email,
      templateData: {
        verifyLink: input.emailVerifyLink,
      },
    });
  };
};

export default sendEmailVerificationEmail;
