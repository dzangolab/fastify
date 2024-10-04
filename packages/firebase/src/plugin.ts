import FastifyPlugin from "fastify-plugin";

import { initializeFirebase } from "./lib";
import runMigrations from "./migrations/runMigrations";
import notificationRoutes from "./model/notification/controller";
import userDevicesRoutes from "./model/userDevice/controller";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void,
) => {
  const { config, slonik, log } = fastify;

  if (config.firebase.enabled === false) {
    log.info("fastify-firebase plugin is not enabled");
  } else {
    log.info("Registering fastify-firebase plugin");

    await runMigrations(slonik, config);

    initializeFirebase(config, fastify);
  }

  const { routePrefix, routes } = config.firebase;

  if (!routes?.notifications?.disabled) {
    await fastify.register(notificationRoutes, { prefix: routePrefix });
  }

  if (!routes?.userDevices?.disabled) {
    await fastify.register(userDevicesRoutes, { prefix: routePrefix });
  }

  done();
};

export default FastifyPlugin(plugin);
