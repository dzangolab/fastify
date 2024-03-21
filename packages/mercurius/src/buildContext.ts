import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

const buildContext = async (request: FastifyRequest, reply: FastifyReply) => {
  const plugins = request.config.mercurius.plugins;

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

export default buildContext;
