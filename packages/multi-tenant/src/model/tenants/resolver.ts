import Service from "./service";

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
    const input = arguments_.data as TenantCreateInput;

    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    return await service.create(input);
  },
};

const Query = {
  tenant: async (
    parent: unknown,
    arguments_: { slug: string },
    context: MercuriusContext
  ) => {
    const service = new Service(
      context.config,
      context.database,
      context.dbSchema
    );

    return await service.findByHostname(arguments_.slug);
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
