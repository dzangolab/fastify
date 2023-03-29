import Service from "./service";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Query: Record<string, any> = {
  user: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

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
    const service = new Service(context.config, context.database);

    return await service.paginatedList(
      arguments_.limit,
      arguments_.offset,
      arguments_.filters
        ? JSON.parse(JSON.stringify(arguments_.filters))
        : undefined,
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined
    );
  },
};

export default { Query };
