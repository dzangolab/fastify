import mercurius from "mercurius";

import Service from "./service";
import getMultiTenantConfig from "../../lib/getMultiTenantConfig";
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
    if (context.tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot be used to create tenant",
        undefined,
        403
      );
    }

    const userId = context.user?.id;

    if (userId) {
      const input = arguments_.data as TenantCreateInput;

      validateTenantInput(context.config, input);

      const multiTenantConfig = getMultiTenantConfig(context.config);

      input[multiTenantConfig.table.columns.ownerId] = userId;

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
    if (context.tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot retrieve tenant information",
        undefined,
        403
      );
    }

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
    if (context.tenant) {
      return new mercurius.ErrorWithProps(
        "Tenant app cannot display a list of tenants",
        undefined,
        403
      );
    }

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
