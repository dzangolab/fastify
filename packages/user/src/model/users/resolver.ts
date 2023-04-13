import mercurius from "mercurius";

import Service from "./service";

import type { UserProfileUpdateInput } from "./../../types";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  changePassword: async (
    parent: unknown,
    arguments_: {
      oldPassword: string;
      newPassword: string;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

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
  updateUserProfile: async (
    parent: unknown,
    arguments_: {
      data: UserProfileUpdateInput;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    try {
      if (context.user?.id) {
        const updateProfileResponse = await service.update(
          context.user.id,
          arguments_.data
        );

        return updateProfileResponse;
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
  me: async (
    parent: unknown,
    arguments_: unknown,
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);
    if (context.user?.id) {
      return service.getUserById(context.user.id);
    } else {
      context.app.log.error("Cound not get user id from mercurius context");

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

export default { Mutation, Query };
