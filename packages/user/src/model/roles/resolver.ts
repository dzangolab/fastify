import mercurius from "mercurius";

import Service from "./service";
import CustomApiError from "../../customApiError";

import type { RoleCreateInput, RoleUpdateInput } from "../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  createRole: async (
    parent: unknown,
    arguments_: {
      data: RoleCreateInput;
    },
    context: MercuriusContext
  ) => {
    const { app, config, database } = context;

    const service = new Service(config, database);

    try {
      const role = await service.create(arguments_.data);

      return role;
    } catch (error) {
      if (error instanceof CustomApiError) {
        const mercuriusError = new mercurius.ErrorWithProps(error.name);

        mercuriusError.statusCode = error.statusCode;

        return mercuriusError;
      }

      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },

  deleteRole: async (
    parent: unknown,
    arguments_: {
      id: number;
    },
    context: MercuriusContext
  ) => {
    const { app, config, database } = context;

    const service = new Service(config, database);

    try {
      const role = await service.delete(arguments_.id);

      return role;
    } catch (error) {
      if (error instanceof CustomApiError) {
        const mercuriusError = new mercurius.ErrorWithProps(error.name);

        mercuriusError.statusCode = error.statusCode;

        return mercuriusError;
      }

      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },

  updateRole: async (
    parent: unknown,
    arguments_: {
      id: number;
      data: RoleUpdateInput;
    },
    context: MercuriusContext
  ) => {
    const { app, config, database } = context;

    const service = new Service(config, database);

    try {
      const role = await service.update(
        arguments_.id as number,
        arguments_.data as RoleUpdateInput
      );

      return role;
    } catch (error) {
      if (error instanceof CustomApiError) {
        const mercuriusError = new mercurius.ErrorWithProps(error.name);

        mercuriusError.statusCode = error.statusCode;

        return mercuriusError;
      }

      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );

      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

const Query = {
  role: async (
    parent: unknown,
    arguments_: { id: number },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    return await service.findById(arguments_.id);
  },

  roles: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext
  ) => {
    const { config, database } = context;

    const service = new Service(config, database);

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
