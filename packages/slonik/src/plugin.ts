import FastifyPlugin from "fastify-plugin";
import { stringifyDsn } from "slonik";

import createClientConfiguration from "./factories/createClientConfiguration";
import runPackageMigrations from "./migrations/runPackageMigrations";
import { fastifySlonik } from "./slonik";

import type { SlonikConfig } from "./types";
import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance, options: SlonikConfig) => {
  if (Object.keys(options).length === 0) {
    fastify.log.warn(
      "The slonik plugin now recommends passing slonik options directly to the plugin.",
    );

    if (!fastify.config?.slonik) {
      throw new Error(
        "Missing slonik configuration. Did you forget to pass it to the slonik plugin?",
      );
    }

    options = fastify.config.slonik;
  }

  fastify.log.info("Registering fastify-slonik plugin");

  await fastify.register(fastifySlonik, {
    connectionString: stringifyDsn(options.db),
    clientConfiguration: createClientConfiguration(
      options?.clientConfiguration,
    ),
  });

  if (options.migrations?.package !== false) {
    await runPackageMigrations(fastify.slonik);
  }

  fastify.decorateRequest("dbSchema", "");
};

export default FastifyPlugin(plugin);
