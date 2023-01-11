import FastifyPlugin from "fastify-plugin";

import TenantService from "./model/tenants/service";
import runMigrations from "./runMigrations";
import changeSchema from "./utils/changeSchema";
import getDatabaseConfig from "./utils/getDatabaseConfig";
import initializePgPool from "./utils/initializePgPool";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: { config: ApiConfig },
  done: () => void
) => {
  try {
    fastify.log.info("Registering fastify-multi-tenant plugin");

    const databaseConfig = getDatabaseConfig(fastify.config.slonik);

    // DU [2023-JAN-06] This smells
    const client = await initializePgPool(databaseConfig);

    const migrationPath = fastify.config.slonik.migrations.path;

    const tenantService = TenantService(
      fastify.config,
      fastify.slonik,
      fastify.sql
    );
    const tenants = await tenantService.all();

    for (const tenant of tenants.values()) {
      fastify.log.info(`Running migrations for tenant ${tenant.name}`);

      await runMigrations({ client }, migrationPath + "/tenants", tenant.slug);
    }

    await changeSchema(client, "public");

    await client.end();
  } catch (error: unknown) {
    fastify.log.error("🔴 Failed to run the migrations");
    throw error;
  }

  done();
};

export default FastifyPlugin(plugin);
