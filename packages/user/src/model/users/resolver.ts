import Service from "./service";

import type { MercuriusContext } from "mercurius";

const Query = {
  user: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext
  ) => {
    const service = Service(context.config, context.database, context.sql);

    return await service.findById(arguments_.id);
  },

  users: async (
    parent: unknown,
    arguments_: { limit: number; offset: number },
    context: MercuriusContext
  ) => {
    const service = Service(context.config, context.database, context.sql);

    return await service.list(arguments_.limit, arguments_.offset);
  },
};

export default { Query };
