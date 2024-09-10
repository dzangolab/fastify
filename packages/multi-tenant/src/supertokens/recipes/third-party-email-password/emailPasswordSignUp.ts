import { areRolesExist, sendEmail, verifyEmail } from "@dzangolab/fastify-user";
import { deleteUser } from "supertokens-node";
import EmailVerification from "supertokens-node/recipe/emailverification";
import UserRoles from "supertokens-node/recipe/userroles";

import getUserService from "../../../lib/getUserService";
import Email from "../../utils/email";

import type { User } from "@dzangolab/fastify-user";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance,
): RecipeInterface["emailPasswordSignUp"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    const roles = (input.userContext.roles || []) as string[];

    if (!(await areRolesExist(roles))) {
      log.error(`At least one role from ${roles.join(", ")} does not exist.`);

      throw {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500,
      } as FastifyError;
    }

    const originalEmail = input.email;

    input.email = Email.addTenantPrefix(
      config,
      originalEmail,
      input.userContext.tenant,
    );

    const originalResponse =
      await originalImplementation.emailPasswordSignUp(input);

    if (originalResponse.status === "OK") {
      const userService = getUserService(
        config,
        slonik,
        input.userContext.tenant,
      );

      let user: User | null | undefined;

      try {
        user = await userService.create({
          id: originalResponse.user.id,
          email: originalEmail,
        });

        if (!user) {
          throw new Error("User not found");
        }
        /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (error: any) {
        log.error("Error while creating user");
        log.error(error);

        await deleteUser(originalResponse.user.id);

        throw {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500,
        };
      }

      user.roles = roles;

      originalResponse.user = {
        ...originalResponse.user,
        ...user,
      };

      for (const role of roles) {
        const rolesResponse = await UserRoles.addRoleToUser(
          originalResponse.user.id,
          role,
        );

        if (rolesResponse.status !== "OK") {
          log.error(rolesResponse.status);
        }
      }

      if (config.user.features?.signUp?.emailVerification) {
        try {
          if (input.userContext.autoVerifyEmail) {
            // auto verify email
            await verifyEmail(user.id);
          } else {
            // send email verification
            const tokenResponse =
              await EmailVerification.createEmailVerificationToken(
                originalResponse.user.id,
              );

            if (tokenResponse.status === "OK") {
              // [DU 2023-SEP-4] We need to provide all the arguments.
              // emailVerifyLink is same as what would supertokens create.
              await EmailVerification.sendEmail({
                type: "EMAIL_VERIFICATION",
                user: {
                  id: originalResponse.user.id,
                  email: input.email,
                },
                emailVerifyLink: `${config.appOrigin[0]}/auth/verify-email?token=${tokenResponse.token}&rid=emailverification`,
                userContext: input.userContext,
              });
            }
          }
        } catch (error) {
          log.error(error);
        }
      }
    }

    if (
      config.user.supertokens.sendUserAlreadyExistsWarning &&
      originalResponse.status === "EMAIL_ALREADY_EXISTS_ERROR"
    ) {
      try {
        sendEmail({
          fastify,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: originalEmail,
          },
          templateName: "duplicate-email-warning",
          to: originalEmail,
        });
      } catch (error) {
        log.error(error);
      }
    }

    return originalResponse;
  };
};

export default emailPasswordSignUp;
