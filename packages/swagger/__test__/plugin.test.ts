import Fastify from "fastify";
import { describe, it, expect } from "vitest";

import plugin from "../src/index";

describe("plugin", () => {
  it("should be exported as default and register without issues", async () => {
    const fastify = Fastify();

    const options = {
      enabled: true,
      fastifySwaggerOptions: {
        openapi: {
          info: {
            title: "Test API",
            version: "1.0.0",
          },
        },
      },
    };

    await expect(fastify.register(plugin, options)).resolves.not.toThrow();
  });

  it("should not register API documentation when enabled is set to false", async () => {
    const fastify = Fastify();

    const options = {
      enabled: false,
      fastifySwaggerOptions: {
        openapi: {
          info: {
            title: "Test API",
            version: "1.0.0",
          },
        },
      },
    };

    await fastify.register(plugin, options);
    await fastify.ready();

    expect(fastify.swagger).toBeUndefined();
    expect(fastify.apiDocumentationPath).toBeUndefined();

    await fastify.close();
  });

  it("should change the documentation path when routePrefix is modified", async () => {
    const fastify = Fastify();

    const options = {
      enabled: true,
      fastifySwaggerOptions: {
        openapi: {
          info: {
            title: "Test API",
            version: "1.0.0",
          },
        },
      },
      uiOptions: {
        routePrefix: "/docs",
      },
    };

    await fastify.register(plugin, options);

    expect(fastify.apiDocumentationPath).toBe("/docs");
  });
});
