import FastifyPlugin from "fastify-plugin";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-firebase plugin");

  done();
};

export default FastifyPlugin(plugin);
