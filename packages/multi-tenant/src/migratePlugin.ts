import FastifyPlugin from "fastify-plugin";

import TenantService from "./model/tenants/service";
import getMultiTenantConfig from "./multiTenantConfig";
import runMigrations from "./runMigrations";
import changeSchema from "./utils/changeSchema";
import getDatabaseConfig from "./utils/getDatabaseConfig";
import initializePgPool from "./utils/initializePgPool";

import type { FastifyInstance } from "fastify";

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

    const migrationPath = config.slonik.migrations.path;

    const tenantService = TenantService(config, slonik, sql);

    const tenants = await tenantService.all();

    const multiTenantConfig = getMultiTenantConfig(config);

    for (const tenant of tenants.values()) {
      const { name: nameColumn, slug: slugColumn } =
        multiTenantConfig.table.columns;
      const tenantsMigrationsDirectory = multiTenantConfig.migrations.directory;

      const migrationsDirectory = `${migrationPath}/${tenantsMigrationsDirectory}`;

      const { [nameColumn]: name, [slugColumn]: slug } = tenant;

      /* eslint-disable-next-line unicorn/consistent-destructuring */
      fastify.log.info(`Running migrations for tenant ${name}`);

      await runMigrations({ client }, migrationsDirectory, slug);
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
