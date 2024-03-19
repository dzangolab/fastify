import * as pg from "pg";
import type { Tenant } from "../types";
import type { ClientConfig } from "pg";
declare const runMigrations: (migrateConfig: ClientConfig | {
    readonly client: pg.Client | pg.PoolClient | pg.Pool;
}, migrationsPath: string, tenant: Tenant) => Promise<boolean>;
export default runMigrations;
//# sourceMappingURL=runMigrations.d.ts.map