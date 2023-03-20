import { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
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
    const service = new Service(context.config, context.database);

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
