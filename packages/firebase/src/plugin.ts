import FastifyPlugin from "fastify-plugin";

import { initializeFirebase } from "./lib";
import runMigrations from "./migrations/runMigrations";
import notificationRoutes from "./model/notification/controller";
import userDevicesRoutes from "./model/userDevice/controller";

import type { FirebaseOptions } from "./types";
import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance, options: FirebaseOptions) => {
  if (Object.keys(options).length === 0) {
    fastify.log.warn(
      "The firebase plugin now recommends passing firebase options directly to the plugin.",
    );

    if (!fastify.config?.firebase) {
      throw new Error(
        "Missing firebase configuration. Did you forget to pass it to the firebase plugin?",
      );
    }

    options = fastify.config.firebase;
  }

  const { slonik, log } = fastify;

  if (options.enabled === false) {
    log.info("fastify-firebase plugin is not enabled");
  } else {
    log.info("Registering fastify-firebase plugin");

    await runMigrations(slonik, options);

    initializeFirebase(options, fastify);

    const { routePrefix, routes } = options;

    if (!routes?.notifications?.disabled) {
      await fastify.register(notificationRoutes, { prefix: routePrefix });
    }

    if (!routes?.userDevices?.disabled) {
      await fastify.register(userDevicesRoutes, { prefix: routePrefix });
    }
  }
};

export default FastifyPlugin(plugin);
