import { UserService } from "@dzangolab/fastify-user";
import UserRoles from "supertokens-node/recipe/userroles";

import Email from "./utils/email";
import getTenantMappedSlug from "./utils/getTenantMappedSlug";
import sendEmail from "./utils/sendEmail";

import type {
  User,
  UserCreateInput,
  UserUpdateInput,
} from "@dzangolab/fastify-user";
import type { FastifyInstance, FastifyError } from "fastify";
import type { QueryResultRow } from "slonik";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const emailPasswordSignUp = (
  originalImplementation: RecipeInterface,
  fastify: FastifyInstance
): RecipeInterface["emailPasswordSignUp"] => {
  const { config, log, slonik } = fastify;

  return async (input) => {
    if (config.user.features?.signUp === false) {
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404,
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
      const userService: UserService<
        User & QueryResultRow,
        UserCreateInput,
        UserUpdateInput
      > = new UserService(
        config,
        slonik,
        input.userContext.tenant[getTenantMappedSlug(config)]
      );

      const user = await userService.create({
        id: originalResponse.user.id,
        email: originalEmail,
      });

      if (!user) {
        log.error(`Unable to create user ${originalResponse.user.id}`);

        throw new Error(`Unable to create user ${originalResponse.user.id}`);
      }

      originalResponse.user = {
        ...originalResponse.user,
        ...user,
      };

      const rolesResponse = await UserRoles.addRoleToUser(
        originalResponse.user.id,
        config.user.role || "USER"
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
        await sendEmail({
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
