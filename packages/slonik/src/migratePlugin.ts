import FastifyPlugin from "fastify-plugin";
import { migrate as runMigrations } from "pg-node-migrations";
import { sql } from "slonik";

import TenantService from "./model/tenants/service";
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

    const path = fastify.config.slonik.migrations.path;

    await runMigrations(migrateDatabaseConfig, path);

    const tenantService = TenantService(fastify.config, fastify.slonik, sql);

    const tenants = await tenantService.all();

    for (const tenant of tenants.values()) {
      await runMigrations(migrateDatabaseConfig, path + "/tenants", {
        schemaName: tenant.slug,
      });
    }
  } catch (error: unknown) {
    fastify.log.error("🔴 Failed to run the migrations");
    throw error;
  }

  done();
};

export default FastifyPlugin(migratePlugin);
