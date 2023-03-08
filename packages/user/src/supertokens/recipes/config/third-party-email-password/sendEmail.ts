import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

import mailer from "../../../utils/sendEmail";
import updateEmail from "../../../utils/updateEmail";

import type { Tenant } from "@dzangolab/fastify-multi-tenant";
import type { FastifyInstance } from "fastify";

const sendEmail = (
  fastify: FastifyInstance
): typeof ThirdPartyEmailPassword.sendEmail => {
  const websiteDomain = fastify.config.appOrigin[0] as string;
  const resetPasswordPath = "/reset-password";

  return async (input) => {
    const tenant: Tenant = input.userContext.tenant;

    const passwordResetLink = input.passwordResetLink.replace(
      websiteDomain + "/auth/reset-password",
      (tenant
        ? fastify.config.protocol +
          "://" +
          tenant.slug +
          "." +
          fastify.config.multiTenant?.rootDomain
        : websiteDomain) +
        (fastify.config.user.supertokens.resetPasswordPath
          ? (fastify.config.user.supertokens.resetPasswordPath as string)
          : resetPasswordPath)
    );

    await mailer({
      fastify,
      subject: "Reset Password",
      templateName: "reset-password",
      to: updateEmail.removeTenantId(input.user.email, tenant),
      templateData: {
        passwordResetLink,
      },
    });
  };
};

export default sendEmail;
