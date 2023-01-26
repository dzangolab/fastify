import { ApiConfig } from "@dzangolab/fastify-config";
import { MercuriusContext } from "mercurius";

import type { FastifyRequest } from "fastify";

const buildContext = async (request: FastifyRequest) => {
  const plugins = request.config.mercurius.plugins;

  let context = {
    config: request.config as ApiConfig,
    database: request.slonik,
    sql: request.sql,
  } as MercuriusContext;

  if (plugins) {
    for (const plugin of plugins) {
      context = await plugin(context, request);
    }
  }

  return context;
};

export default buildContext;
