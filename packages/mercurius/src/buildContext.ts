import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

const buildContext = async (request: FastifyRequest, reply: FastifyReply) => {
  const plugins = request.config.mercurius.plugins;

  const context = {
    config: request.config as ApiConfig,
    database: request.slonik,
  } as MercuriusContext;

  if (plugins) {
    for (const plugin of plugins) {
      await plugin.updateContext(context, request, reply);
    }
  }

  return context;
};

export default buildContext;
