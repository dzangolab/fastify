import mercurius from "mercurius";

import Service from "./service";
import { validateTenantInput } from "../../lib/validateTenantSchema";

import type { TenantCreateInput } from "./../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  createTenant: async (
    parent: unknown,
    arguments_: {
      data: {
        id: string;
        password: string;
      };
    },
    context: MercuriusContext
  ) => {
    const userId = context.user?.id;

    if (userId) {
      const input = arguments_.data as TenantCreateInput;

      input.ownerId = userId;

      validateTenantInput(context.config, input);

      const service = new Service(
        context.config,
        context.database,
        context.dbSchema
      );

      return await service.create(input);
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
};

const Query = {
  tenant: async (
    parent: unknown,
    arguments_: { id: number },
    context: MercuriusContext
  ) => {
    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    return await service.findById(arguments_.id);
  },
  tenants: async (
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
