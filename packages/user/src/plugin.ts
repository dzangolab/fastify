import FastifyPlugin from "fastify-plugin";

import userRouter from "./model/user-profile/controller";

import type { FastifyInstance } from "fastify";

const plugin = (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  done();
};

export default FastifyPlugin(plugin);
