import FastifyPlugin from "fastify-plugin";

import runMigrations from "./migrations/runMigrations";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: { config: ApiConfig },
  done: () => void
) => {
  const { config, slonik } = fastify;

  await runMigrations(slonik, config);

  done();
};

export default FastifyPlugin(plugin);
