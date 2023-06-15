import mercurius from "mercurius";

import filterUserUpdateInput from "./filterUserUpdateInput";
import Service from "./service";

import type { UserUpdateInput } from "./../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
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
