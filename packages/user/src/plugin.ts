import FastifyPlugin from "fastify-plugin";

import userRouter from "./model/users/controller";

import type { FastifyInstance } from "fastify";

const plugin = (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  fastify.register(userRouter);

  done();
};

export default FastifyPlugin(plugin);
