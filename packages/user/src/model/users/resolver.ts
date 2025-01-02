import mercurius from "mercurius";
import { EmailVerificationClaim } from "supertokens-node/recipe/emailverification";
import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import filterUserUpdateInput from "./filterUserUpdateInput";
import { ROLE_ADMIN, ROLE_SUPERADMIN } from "../../constants";
import getUserService from "../../lib/getUserService";
import createUserContext from "../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../supertokens/utils/profileValidationClaim";
import validateEmail from "../../validator/email";
import validatePassword from "../../validator/password";

import type { UserUpdateInput } from "./../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  adminSignUp: async (
    parent: unknown,
    arguments_: {
      data: {
        email: string;
        password: string;
      };
    },
    context: MercuriusContext,
  ) => {
    const { app, config, reply } = context;

    try {
      const { email, password } = arguments_.data;

      // check if already admin user exists
      const adminUsers = await UserRoles.getUsersThatHaveRole(ROLE_ADMIN);
      const superAdminUsers =
        await UserRoles.getUsersThatHaveRole(ROLE_SUPERADMIN);

      let errorMessage: string | undefined;

      if (
        adminUsers.status === "UNKNOWN_ROLE_ERROR" &&
        superAdminUsers.status === "UNKNOWN_ROLE_ERROR"
      ) {
        errorMessage = adminUsers.status;
      } else if (
        (adminUsers.status === "OK" && adminUsers.users.length > 0) ||
        (superAdminUsers.status === "OK" && superAdminUsers.users.length > 0)
      ) {
        errorMessage = "First admin user already exists";
      }

      if (errorMessage) {
        const mercuriusError = new mercurius.ErrorWithProps(errorMessage);

        return mercuriusError;
      }

      //  check if the email is valid
      const emailResult = validateEmail(email, config);

      if (!emailResult.success && emailResult.message) {
        const mercuriusError = new mercurius.ErrorWithProps(
          emailResult.message,
        );

        return mercuriusError;
      }

      // password strength validation
      const passwordStrength = validatePassword(password, config);

      if (!passwordStrength.success && passwordStrength.message) {
        const mercuriusError = new mercurius.ErrorWithProps(
          passwordStrength.message,
        );

        return mercuriusError;
      }

      // signup
      const signUpResponse = await emailPasswordSignUp(email, password, {
        autoVerifyEmail: true,
        roles: [
          ROLE_ADMIN,
          ...(superAdminUsers.status === "OK" ? [ROLE_SUPERADMIN] : []),
        ],
        _default: {
          request: {
            request: reply.request,
          },
        },
      });

      if (signUpResponse.status !== "OK") {
        const mercuriusError = new mercurius.ErrorWithProps(
          signUpResponse.status,
        );

        return mercuriusError;
      }

      // create new session so the user be logged in on signup
      await createNewSession(reply.request, reply, signUpResponse.user.id);

      return signUpResponse;
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  disableUser: async (
    parent: unknown,
    arguments_: {
      id: string;
    },
    context: MercuriusContext,
  ) => {
    const { id } = arguments_;

    if (context.user?.id === id) {
      const mercuriusError = new mercurius.ErrorWithProps(
        `you cannot disable yourself`,
      );

      mercuriusError.statusCode = 409;

      return mercuriusError;
    }

    const service = getUserService(
      context.config,
      context.database,
      context.dbSchema,
    );

    const response = await service.update(id, { disabled: true });

    if (!response) {
      return new mercurius.ErrorWithProps(`user id ${id} not found`, {}, 404);
    }

    return { status: "OK" };
  },
  enableUser: async (
    parent: unknown,
    arguments_: {
      id: string;
    },
    context: MercuriusContext,
  ) => {
    const { id } = arguments_;

    const service = getUserService(
      context.config,
      context.database,
      context.dbSchema,
    );

    const response = await service.update(id, { disabled: false });

    if (!response) {
      return new mercurius.ErrorWithProps(`user id ${id} not found`, {}, 404);
    }

    return { status: "OK" };
  },
  changePassword: async (
    parent: unknown,
    arguments_: {
      oldPassword: string;
      newPassword: string;
    },
    context: MercuriusContext,
  ) => {
    const { app, config, database, dbSchema, reply, user } = context;

    const service = getUserService(config, database, dbSchema);

    try {
      if (user) {
        const response = await service.changePassword(
          user.id,
          arguments_.oldPassword,
          arguments_.newPassword,
        );

        if (response.status === "OK") {
          await createNewSession(reply.request, reply, user.id);
        }

        return response;
      } else {
        return {
          status: "NOT_FOUND",
          message: "User not found",
        };
      }
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  updateMe: async (
    parent: unknown,
    arguments_: {
      data: UserUpdateInput;
    },
    context: MercuriusContext,
  ) => {
    const { data } = arguments_;

    const service = getUserService(
      context.config,
      context.database,
      context.dbSchema,
    );

    try {
      if (context.user?.id) {
        filterUserUpdateInput(data);

        const user = await service.update(context.user.id, data);

        const request = context.reply.request;

        request.user = user;

        if (context.config.user.features?.profileValidation?.enabled) {
          await request.session?.fetchAndSetClaim(
            new ProfileValidationClaim(),
            createUserContext(undefined, request),
          );
        }

        return user;
      } else {
        return {
          status: "NOT_FOUND",
          message: "User not found",
        };
      }
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      context.app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  changeEmail: async (
    parent: unknown,
    arguments_: {
      email: string;
    },
    context: MercuriusContext,
  ) => {
    const { app, config, database, dbSchema, user } = context;

    try {
      if (user) {
        if (config.user.features?.updateEmail?.enabled === false) {
          return {
            status: "EMAIL_FEATURE_DISABLED_ERROR",
            message: "Update email feature is currently disabled.",
          };
        }

        const request = context.reply.request;

        if (config.user.features?.profileValidation?.enabled) {
          await request.session?.fetchAndSetClaim(
            new ProfileValidationClaim(),
            createUserContext(undefined, request),
          );
        }

        if (config.user.features?.signUp?.emailVerification) {
          await request.session?.fetchAndSetClaim(
            EmailVerificationClaim,
            createUserContext(undefined, request),
          );
        }

        const emailValidationResult = validateEmail(arguments_.email, config);

        if (!emailValidationResult.success) {
          return {
            status: "EMAIL_INVALID_ERROR",
            message: emailValidationResult.message,
          };
        }

        if (user.email === arguments_.email) {
          return {
            status: "EMAIL_SAME_AS_CURRENT_ERROR",
            message: "Email is same as the current one.",
          };
        }

        const service = getUserService(config, database, dbSchema);

        const response = await service.changeEmail(user.id, arguments_.email);

        request.user = response;

        return {
          status: "OK",
          message: "Email updated successfully.",
        };
      } else {
        return {
          status: "NOT_FOUND",
          message: "User not found",
        };
      }
      /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      // FIXME [OP 28 SEP 2022]
      app.log.error(error);

      if (error.message === "EMAIL_ALREADY_EXISTS_ERROR") {
        return {
          status: error.message,
        };
      }

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

const Query = {
  canAdminSignUp: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext,
  ) => {
    const { app } = context;

    try {
      // check if already admin user exists
      const adminUsers = await UserRoles.getUsersThatHaveRole(ROLE_ADMIN);
      const superAdminUsers =
        await UserRoles.getUsersThatHaveRole(ROLE_SUPERADMIN);

      if (
        adminUsers.status === "UNKNOWN_ROLE_ERROR" &&
        superAdminUsers.status === "UNKNOWN_ROLE_ERROR"
      ) {
        const mercuriusError = new mercurius.ErrorWithProps(adminUsers.status);

        return mercuriusError;
      } else if (
        (adminUsers.status === "OK" && adminUsers.users.length > 0) ||
        (superAdminUsers.status === "OK" && superAdminUsers.users.length > 0)
      ) {
        return { signUp: false };
      }

      return { signUp: true };
    } catch (error) {
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops! Something went wrong",
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  me: async (
    parent: unknown,
    arguments_: Record<string, never>,
    context: MercuriusContext,
  ) => {
    if (context.user) {
      return context.user;
    } else {
      context.app.log.error(
        "Could not able to get user from mercurius context",
      );

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong",
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  user: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext,
  ) => {
    const service = getUserService(
      context.config,
      context.database,
      context.dbSchema,
    );

    const user = await service.findById(arguments_.id);

    if (context.config.user.features?.profileValidation?.enabled) {
      const request = context.reply.request;

      await request.session?.fetchAndSetClaim(
        new ProfileValidationClaim(),
        createUserContext(undefined, request),
      );
    }

    return user;
  },
  users: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext,
  ) => {
    const service = getUserService(
      context.config,
      context.database,
      context.dbSchema,
    );

    return await service.list(
      arguments_.limit,
      arguments_.offset,
      arguments_.filters
        ? JSON.parse(JSON.stringify(arguments_.filters))
        : undefined,
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined,
    );
  },
};

export default { Mutation, Query };
