import FastifyPlugin from "fastify-plugin";

import type { MercuriusEnabledPlugin } from "../../types";
import type { FastifyInstance } from "fastify";
import type { MercuriusContext } from "mercurius";

declare module "mercurius" {
  interface MercuriusContext {
    testCallback: {
      testValue: string;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    testCallback: {
      testValue: string;
    };
  }
}

const plugin = FastifyPlugin(
  (fastify: FastifyInstance, options: unknown, done: () => void) => {
    fastify.decorate("testCallback", {
      testValue: "Callback context added",
    });
    done();
  }
) as MercuriusEnabledPlugin;

plugin.updateContext = async (context: MercuriusContext) => {
  context.testCallback = {
    testValue: "Callback context added",
  };
};

export default plugin;
