import mercurius from "mercurius";

import Service from "./service";

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
      if (context.user?.id) {
        const changePasswordResponse = await service.changePassword(
          context.user?.id,
          arguments_.oldPassword,
          arguments_.newPassword
        );

        return changePasswordResponse;
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
      return service.getUserById(context.user.id, context.tenant);
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
