import FastifyPlugin from "fastify-plugin";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: { config: ApiConfig },
  done: () => void
) => {
  done();
};

export default FastifyPlugin(plugin);
