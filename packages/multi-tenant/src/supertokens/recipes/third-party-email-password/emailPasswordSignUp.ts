import { isRoleExists, sendEmail } from "@dzangolab/fastify-user";
import { deleteUser } from "supertokens-node";
import UserRoles from "supertokens-node/recipe/userroles";

import getUserService from "../../../lib/getUserService";
import Email from "../../utils/email";

import type { User } from "@dzangolab/fastify-user";
import type { FastifyInstance, FastifyError } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignUp"] => {
  const { config, log, mailer, slonik } = fastify;

  return async (input) => {
    if (config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
      } as FastifyError;
    }

    const role = config.user.role || "USER";

    if (!(await isRoleExists(role))) {
      log.error(`Role "${role}" does not exist`);

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
      input.userContext.tenant
    );

    const originalResponse = await originalImplementation.emailPasswordSignUp(
      input
    );

    if (originalResponse.status === "OK") {
      const userService = getUserService(
        config,
        slonik,
        input.userContext.tenant
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

      user.roles = [config.user.role || "USER"];

      originalResponse.user = {
        ...originalResponse.user,
        ...user,
      };

      const rolesResponse = await UserRoles.addRoleToUser(
        originalResponse.user.id,
        role
      );

      if (rolesResponse.status !== "OK") {
        log.error(rolesResponse.status);
      }
    }

    if (
      config.user.supertokens.sendUserAlreadyExistsWarning &&
      originalResponse.status === "EMAIL_ALREADY_EXISTS_ERROR"
    ) {
      try {
        sendEmail({
          config,
          log,
          mailer,
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
