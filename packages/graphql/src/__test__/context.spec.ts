import fastify from "fastify";
import { describe, expect, it, beforeEach } from "vitest";

import graphqlPlugin from "../plugin";
import createConfig from "./helpers/createConfig";
import testPlugin from "./helpers/testPlugin";
import testPluginAsync from "./helpers/testPluginAsync";

import type { FastifyInstance } from "fastify";

describe("Graphql Context", async () => {
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

    await api.register(graphqlPlugin);

    const response = await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
          query test {
            test{
              propertyTwo
              propertyOne
            }
          }
        `,
      },
      url: "/graphql",
    });

    expect(JSON.parse(response.payload).data.test).toEqual({
      //eslint-disable-next-line unicorn/no-null
      propertyOne: null,
      propertyTwo: "Property Two",
    });

    expect(api).toHaveProperty(["propertyTwo"], "Property Two");
  });

  it("Should add context property and value from Async test plugin", async () => {
    api.addHook("onRequest", async (request) => {
      request.config = createConfig([testPluginAsync]);
    });

    api.decorate("config", createConfig([testPluginAsync]));

    await api.register(testPluginAsync);

    await api.register(graphqlPlugin);

    const response = await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
        query test {
          test{
            propertyTwo
            propertyOne
          }
        }
        `,
      },
      url: "/graphql",
    });

    expect(JSON.parse(response.payload).data.test).toEqual({
      //eslint-disable-next-line unicorn/no-null
      propertyTwo: null,
      propertyOne: "Property One",
    });

    expect(api).toHaveProperty(["propertyOne"], "Property One");
  });

  it("Should add context property and value from Async/Callback test plugin", async () => {
    api.addHook("onRequest", async (request) => {
      request.config = createConfig([testPlugin, testPluginAsync]);
    });

    api.decorate("config", createConfig([testPlugin, testPluginAsync]));

    await api.register(graphqlPlugin);
    await api.register(testPlugin);
    await api.register(testPluginAsync);

    const response = await api.inject({
      method: "POST",
      payload: {
        operationName: "test",
        query: `
        query test {
          test{
            propertyTwo
            propertyOne
          }
        }
        `,
      },
      url: "/graphql",
    });

    expect(JSON.parse(response.payload).data.test).toEqual({
      propertyTwo: "Property Two",
      propertyOne: "Property One",
    });

    expect(api).toHaveProperty(["propertyTwo"], "Property Two");

    expect(api).toHaveProperty(["propertyOne"], "Property One");
  });
});
