import fastify from "fastify";
import { describe, expect, it, beforeEach } from "vitest";

import createConfig from "./helpers/createConfig";
import testPlugin from "./helpers/testPlugin";
import testPluginAsync from "./helpers/testPluginAsync";
import mercuriusPlugin from "../plugin";

import type { FastifyInstance } from "fastify";

describe("Mercurius Context", async () => {
  let api: FastifyInstance;

  beforeEach(async () => {
    api = await fastify();
  });

  it("Should add context property and value from callback test plugin", async () => {
    api.addHook("onRequest", async (request) => {
      request.config = createConfig([testPlugin]);
    });

    api.decorate("config", createConfig([testPlugin]));

    api.register(testPlugin);

    await api.register(mercuriusPlugin);

    const response = await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
          query test {
            test{
              testCallback
              testAsync
            }
          }
        `,
      },
      url: "/graphql",
    });

    expect(JSON.parse(response.payload).data.test).toEqual({
      testCallback: "Callback context added",
      //eslint-disable-next-line unicorn/no-null
      testAsync: null,
    });

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

    const response = await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
        query test {
          test{
            testCallback
            testAsync
          }
        }
        `,
      },
      url: "/graphql",
    });

    expect(JSON.parse(response.payload).data.test).toEqual({
      //eslint-disable-next-line unicorn/no-null
      testCallback: null,
      testAsync: "Async context added",
    });

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
    await api.register(testPlugin);
    await api.register(testPluginAsync);

    const response = await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
        query test {
          test{
            testCallback
            testAsync
          }
        }
        `,
      },
      url: "/graphql",
    });

    expect(JSON.parse(response.payload).data.test).toEqual({
      testCallback: "Callback context added",
      testAsync: "Async context added",
    });

    expect(api).toHaveProperty(
      ["testCallback", "testValue"],
      "Callback context added"
    );

    expect(api).toHaveProperty(
      ["testAsync", "testValue"],
      "Async context added"
    );
  });
});
