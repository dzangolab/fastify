import FastifyPlugin from "fastify-plugin";

import type { MercuriusEnabledPlugin } from "../../types";
import type { FastifyInstance } from "fastify";
import type { MercuriusContext } from "mercurius";

declare module "mercurius" {
  interface MercuriusContext {
    propertyTwo: string;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    propertyTwo: string;
  }
}

const plugin = FastifyPlugin(
  (fastify: FastifyInstance, options: unknown, done: () => void) => {
    fastify.decorate("propertyTwo", "Property Two");
    done();
  }
) as MercuriusEnabledPlugin;

plugin.updateContext = async (context: MercuriusContext) => {
  context.propertyTwo = "Property Two";
};

export default plugin;
