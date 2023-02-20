import { existsSync } from "node:fs";

import FastifyPlugin from "fastify-plugin";

import changeSchema from "./lib/changeSchema";
import getDatabaseConfig from "./lib/getDatabaseConfig";
import initializePgPool from "./lib/initializePgPool";
import getMultiTenantConfig from "./lib/multiTenantConfig";
import runMigrations from "./lib/runMigrations";
import Service from "./model/tenants/service";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  try {
    const { config, slonik } = fastify;

    const databaseConfig = getDatabaseConfig(config.slonik);

    const multiTenantConfig = getMultiTenantConfig(config);

    const migrationsPath = multiTenantConfig.migrations.path;

    if (existsSync(migrationsPath)) {
      const tenantService = new Service(config, slonik);

      const tenants = await tenantService.all(["name", "slug"]);

      // [DU 2023-JAN-06] This smells
      const client = await initializePgPool(databaseConfig);

      for (const tenant of tenants) {
        const migraionSuccess = await runMigrations(
          { client },
          migrationsPath,
          tenant.slug as string
        );

        if (migraionSuccess) {
          /* eslint-disable-next-line unicorn/consistent-destructuring */
          fastify.log.info(`Ran migrations for tenant ${tenant.name}`);
        }
      }

      await changeSchema(client, "public");

      await client.end();
    }
  } catch (error: unknown) {
    fastify.log.error("🔴 multi-tenant: Failed to run tenant migrations");
    throw error;
  }

  done();
};

export default FastifyPlugin(plugin);
