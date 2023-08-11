import mercurius from "mercurius";
import { createNewSession } from "supertokens-node/recipe/session";
import { emailPasswordSignUp } from "supertokens-node/recipe/thirdpartyemailpassword";
import UserRoles from "supertokens-node/recipe/userroles";

import filterUserUpdateInput from "./filterUserUpdateInput";
import Service from "./service";
import { ADMIN_ROLE } from "../../constants";
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
    context: MercuriusContext
  ) => {
    const { app, config, reply } = context;

    try {
      const { email, password } = arguments_.data;

      // check if already admin user exists
      const adminUsers = await UserRoles.getUsersThatHaveRole(ADMIN_ROLE);

      let errorMessage: string | undefined;

      if (adminUsers.status === "UNKNOWN_ROLE_ERROR") {
        errorMessage = adminUsers.status;
      } else if (adminUsers.users.length > 0) {
        errorMessage = "You are not first admin user";
      }

      if (errorMessage) {
        const mercuriusError = new mercurius.ErrorWithProps(errorMessage);

        return mercuriusError;
      }

      //  check if the email is valid
      const emailResult = validateEmail(email, config);

      if (!emailResult.success && emailResult.message) {
        const mercuriusError = new mercurius.ErrorWithProps(
          emailResult.message
        );

        return mercuriusError;
      }

      // password strength validation
      const passwordStrength = validatePassword(password, config);

      if (!passwordStrength.success && passwordStrength.message) {
        const mercuriusError = new mercurius.ErrorWithProps(
          passwordStrength.message
        );

        return mercuriusError;
      }

      // signup
      const signUpResponse = await emailPasswordSignUp(email, password, {
        roles: [ADMIN_ROLE],
      });

      if (signUpResponse.status !== "OK") {
        const mercuriusError = new mercurius.ErrorWithProps(
          signUpResponse.status
        );

        return mercuriusError;
      }

      // create new session so the user be logged in on signup
      await createNewSession(reply.request, reply, signUpResponse.user.id);

      return {
        ...signUpResponse,
        user: {
          ...signUpResponse.user,
          roles: [ADMIN_ROLE],
        },
      };
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  changePassword: async (
    parent: unknown,
    arguments_: {
      oldPassword: string;
      newPassword: string;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    try {
      return context.user?.id
        ? await service.changePassword(
            context.user.id,
            arguments_.oldPassword,
            arguments_.newPassword
          )
        : {
            status: "NOT_FOUND",
            message: "User not found",
          };
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      context.app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
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
    context: MercuriusContext
  ) => {
    const { data } = arguments_;

    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    try {
      if (context.user?.id) {
        filterUserUpdateInput(data);

        return await service.update(context.user.id, data);
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
        "Oops, Something went wrong"
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

const Query = {
  isFirstAdminUser: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext
  ) => {
    const { app } = context;

    try {
      // check if already admin user exists
      const adminUsers = await UserRoles.getUsersThatHaveRole(ADMIN_ROLE);

      if (adminUsers.status === "UNKNOWN_ROLE_ERROR") {
        const mercuriusError = new mercurius.ErrorWithProps(adminUsers.status);

        return mercuriusError;
      } else if (adminUsers.users.length > 0) {
        return false;
      }

      return true;
    } catch (error) {
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops! Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  me: async (
    parent: unknown,
    arguments_: Record<string, never>,
    context: MercuriusContext
  ) => {
    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    if (context.user?.id) {
      return await service.findById(context.user.id);
    } else {
      context.app.log.error(
        "Could not able to get user id from mercurius context"
      );

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
  user: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext
  ) => {
    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    return await service.findById(arguments_.id);
  },
  users: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext
  ) => {
    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    return await service.list(
      arguments_.limit,
      arguments_.offset,
      arguments_.filters
        ? JSON.parse(JSON.stringify(arguments_.filters))
        : undefined,
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined
    );
  },
};

export default { Mutation, Query };
