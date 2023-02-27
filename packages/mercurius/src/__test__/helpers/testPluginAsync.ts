import FastifyPlugin from "fastify-plugin";

import type { MercuriusEnabledPlugin } from "../../types";
import type { FastifyInstance } from "fastify";
import type { MercuriusContext } from "mercurius";

declare module "mercurius" {
  interface MercuriusContext {
    testAsync: {
      testValue: string;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    testAsync: {
      testValue: string;
    };
  }
}

const plugin = FastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.decorate("testAsync", {
    testValue: "Async context added",
  });
}) as MercuriusEnabledPlugin;

plugin.updateContext = async (context: MercuriusContext) => {
  context.testAsync = {
    testValue: "Async context added",
  };
};

export default plugin;
