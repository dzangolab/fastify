import type { Tenant } from "../types";
import type { MigrateDBConfig } from "@dzangolab/postgres-migrations";
declare const runMigrations: (migrateConfig: MigrateDBConfig, migrationsPath: string, tenant: Tenant) => Promise<boolean>;
export default runMigrations;
//# sourceMappingURL=runMigrations.d.ts.map