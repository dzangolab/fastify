import { ApiConfig } from "@dzangolab/fastify-config";
import { FastifyRequest } from "fastify";
import { MercuriusContext } from "mercurius";

const buildContext = async (request: FastifyRequest) => {
  const plugins = request.config.mercurius.plugins;

  let context = {
    config: request.config as ApiConfig,
    database: request.slonik,
    sql: request.sql,
  } as MercuriusContext;

  if (plugins) {
    for (const plugin of plugins) {
      context = await plugin.updateContext(context, request);
    }
  }

  return context;
};

export default buildContext;
