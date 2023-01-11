import FastifyPlugin from "fastify-plugin";
import { sql } from "slonik";

import TenantService from "./model/tenants/service";
import runMigrations from "./runMigrations";
import changeSchema from "./utils/changeSchema";
import createPgPool from "./utils/createPgPool";
import getMigrateDatabaseConfig from "./utils/getMigrateDatabaseConfig";

import type { FastifyInstance } from "fastify";

const migratePlugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  try {
    fastify.log.info("Running database migrations");

    const migrateDatabaseConfig = getMigrateDatabaseConfig(
      fastify.config.slonik
    );

    // DU [2023-JAN-06] This smells
    const client = await createPgPool(migrateDatabaseConfig);

    const path = fastify.config.slonik.migrations.path;

    await runMigrations({ client }, path);

    const tenantService = TenantService(fastify.config, fastify.slonik, sql);
    const tenants = await tenantService.all();

    for (const tenant of tenants.values()) {
      fastify.log.info(`Running migrations for tenant ${tenant.name}`);

      await runMigrations({ client }, path + "/tenants", tenant.slug);
    }

    await changeSchema(client, "public");

    await client.end();
  } catch (error: unknown) {
    fastify.log.error("🔴 Failed to run the migrations");
    throw error;
  }

  done();
};

export default FastifyPlugin(migratePlugin);
