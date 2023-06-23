import { deleteUser } from "supertokens-node";
import UserRoles from "supertokens-node/recipe/userroles";

import UserTermsService from "../../../../model/user-terms/service";
import UserService from "../../../../model/users/service";
import isRoleExists from "../../../utils/isRoleExists";
import sendEmail from "../../../utils/sendEmail";

import type { User, UserCreateInput, UserUpdateInput } from "../../../../types";
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

    const role = config.user.role || "USER";

    if (!(await isRoleExists(role))) {
      log.error(`Role "${role}" does not exist`);

      throw {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500,
      } as FastifyError;
    }

    const originalResponse = await originalImplementation.emailPasswordSignUp(
      input
    );

    if (originalResponse.status === "OK") {
      const userService: UserService<
        User & QueryResultRow,
        UserCreateInput,
        UserUpdateInput
      > = new UserService(config, slonik);

      let user: User | null | undefined;

      try {
        user = await userService.create({
          id: originalResponse.user.id,
          email: originalResponse.user.email,
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

      const userTermsService = new UserTermsService(config, slonik);

      await userTermsService.create({
        userId: originalResponse.user.id,
        termsVersion: config.user.terms?.version || 1,
      });
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
            emailId: input.email,
          },
          templateName: "duplicate-email-warning",
          to: input.email,
        });
      } catch (error) {
        log.error(error);
      }
    }

    return originalResponse;
  };
};

export default emailPasswordSignUp;
