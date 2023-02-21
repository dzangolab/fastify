import FastifyPlugin from "fastify-plugin";
import { MercuriusContext } from "mercurius";

import { MercuriusEnabledPlugin } from "../../types";

import type { FastifyInstance } from "fastify";

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
