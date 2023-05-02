// import mercurius from "mercurius";

import getUserService from "../../lib/getUserService";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const mutation = {};

const query = {
  // me: async (
  //   parent: unknown,
  //   arguments_: Record<string, never>,
  //   context: MercuriusContext
  // ) => {
  //   const service = getUserService(
  //     context.config,
  //     context.database,
  //     context.tenant
  //   );

  //   if (context.user?.id) {
  //     return service.findById(context.user.id);
  //   } else {
  //     context.app.log.error(
  //       "Could not able to get user id from mercurius context"
  //     );

  //     const mercuriusError = new mercurius.ErrorWithProps(
  //       "Oops, Something went wrong"
  //     );
  //     mercuriusError.statusCode = 500;

  //     return mercuriusError;
  //   }
  // },
  user: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext
  ) => {
    const service = getUserService(
      context.config,
      context.database,
      context.tenant
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
    const service = getUserService(
      context.config,
      context.database,
      context.tenant
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

export { mutation, query };
