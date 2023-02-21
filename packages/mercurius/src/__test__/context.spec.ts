import fastify from "fastify";
import { describe, expect, it, vi, beforeEach } from "vitest";

import createConfig from "./helpers/createConfig";
import testPlugin from "./helpers/testPlugin";
import testPluginAsync from "./helpers/testPluginAsync";

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { MercuriusContext } from "mercurius";

let context = {} as MercuriusContext;

vi.mock("../buildContext", () => ({
  default: async (request: FastifyRequest, reply: FastifyReply) => {
    const plugins = request.config.mercurius.plugins;

    if (plugins) {
      for (const plugin of plugins) {
        await plugin.updateContext(context, request, reply);
      }
    }

    return context;
  },
}));

describe("Mercurius Context", async () => {
  let api: FastifyInstance;

  /* eslint-disable-next-line node/no-unsupported-features/es-syntax */
  const { default: mercuriusPlugin } = await import("../plugin");

  beforeEach(async () => {
    api = await fastify();
    context = {} as MercuriusContext;
  });

  it("Should add context property and value from callback test plugin", async () => {
    api.addHook("onRequest", async (request) => {
      request.config = createConfig([testPlugin]);
    });

    api.decorate("config", createConfig([testPlugin]));

    api.register(testPlugin);

    await api.register(mercuriusPlugin);

    await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
          query test($x: Int, $y: Int) {
            test(x: $x, y: $x) 
          }
        `,
        variables: {
          x: 200,
          y: 49,
        },
      },
      url: "/graphql",
    });

    expect(context).toHaveProperty(
      ["testCallback", "testValue"],
      "Callback context added"
    );
    expect(api).toHaveProperty(
      ["testCallback", "testValue"],
      "Callback context added"
    );
  });

  it("Should add context property and value from Async test plugin", async () => {
    api.addHook("onRequest", async (request) => {
      request.config = createConfig([testPluginAsync]);
    });

    api.decorate("config", createConfig([testPluginAsync]));

    await api.register(testPluginAsync);

    await api.register(mercuriusPlugin);

    await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
          query test($x: Int, $y: Int) {
            test(x: $x, y: $x) 
          }
        `,
        variables: {
          x: 200,
          y: 49,
        },
      },
      url: "/graphql",
    });

    expect(context).toHaveProperty(
      ["testAsync", "testValue"],
      "Async context added"
    );
    expect(api).toHaveProperty(
      ["testAsync", "testValue"],
      "Async context added"
    );
  });

  it("Should add context property and value from Async/Callback test plugin", async () => {
    api.addHook("onRequest", async (request) => {
      request.config = createConfig([testPlugin, testPluginAsync]);
    });

    api.decorate("config", createConfig([testPlugin, testPluginAsync]));

    await api.register(mercuriusPlugin);

    await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
          query test($x: Int, $y: Int) {
            test(x: $x, y: $x) 
          }
        `,
        variables: {
          x: 200,
          y: 49,
        },
      },
      url: "/graphql",
    });

    expect(context).toHaveProperty(
      ["testCallback", "testValue"],
      "Callback context added"
    );

    expect(context).toHaveProperty(
      ["testAsync", "testValue"],
      "Async context added"
    );
  });
});
