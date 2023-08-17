import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  fastify.log.info("Registering fastify-s3 plugin");

  done();
};

export default FastifyPlugin(plugin);
