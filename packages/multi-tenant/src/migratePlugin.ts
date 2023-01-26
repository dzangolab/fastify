import FastifyPlugin from "fastify-plugin";

import changeSchema from "./lib/changeSchema";
import getDatabaseConfig from "./lib/getDatabaseConfig";
import initializePgPool from "./lib/initializePgPool";
import getMultiTenantConfig from "./lib/multiTenantConfig";
import runMigrations from "./lib/runMigrations";

import type { FastifyInstance } from "fastify";

import TenantService from "./model/tenants/service";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void
) => {
  try {
    const { config, slonik, sql } = fastify;

    const databaseConfig = getDatabaseConfig(config.slonik);

    // DU [2023-JAN-06] This smells
    const client = await initializePgPool(databaseConfig);

    const tenantService = TenantService(config, slonik, sql);

    const tenants = await tenantService.all();

    const multiTenantConfig = getMultiTenantConfig(config);

    const { name: nameColumn, slug: slugColumn } =
      multiTenantConfig.table.columns;

    const migrationsPath = multiTenantConfig.migrations.path;

    for (const tenant of tenants.values()) {
      const { [nameColumn]: name, [slugColumn]: slug } = tenant;

      /* eslint-disable-next-line unicorn/consistent-destructuring */
      fastify.log.info(`Running migrations for tenant ${name}`);

      await runMigrations({ client }, migrationsPath, slug);
    }

    await changeSchema(client, "public");

    await client.end();
  } catch (error: unknown) {
    fastify.log.error("🔴 multi-tenant: Failed to run the migrations");
    throw error;
  }

  done();
};

export default FastifyPlugin(plugin);
