import type { GraphqlEnabledPlugin } from "./types";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

const buildContext = (plugins?: GraphqlEnabledPlugin[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const context = {
      config: request.config,
      database: request.slonik,
      dbSchema: request.dbSchema,
    } as MercuriusContext;

    if (plugins) {
      for (const plugin of plugins) {
        await plugin.updateContext(context, request, reply);
      }
    }

    return context;
  };
};

export default buildContext;
