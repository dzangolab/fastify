import Service from "./service";

import type {
  OrganizationsCreateInput,
  OrganizationsUpdateInput,
} from "../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  createOrganization: async (
    parent: unknown,
    arguments_: {
      data: OrganizationsCreateInput;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    try {
      if (!context.user) {
        throw new Error("UserId not found in session.");
      }

      const organization = (await service.create(
        arguments_.data
      )) as OrganizationsCreateInput;

      return organization;
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      console.log(error);
    }
  },

  deleteOrganization: async (
    parent: unknown,
    arguments_: {
      id: number;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    try {
      const Organization = await service.delete(arguments_.id as number);

      return Organization;
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      console.log(error);
    }
  },

  updateOrganization: async (
    parent: unknown,
    arguments_: {
      id: number;
      data: OrganizationsUpdateInput;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    try {
      const Organization = await service.update(
        arguments_.id as number,
        arguments_.data as OrganizationsUpdateInput
      );

      return Organization;
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      console.log(error);
    }
  },
};

const Query = {
  organization: async (
    parent: unknown,
    arguments_: { id: number },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    return await service.findById(arguments_.id);
  },

  organizations: async (
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
