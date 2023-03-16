import { MigrateDBConfig } from "@dzangolab/postgres-migrations";
import * as pg from "pg";
declare const initializePgPool: (databaseConfig: MigrateDBConfig) => Promise<pg.Client>;
export default initializePgPool;
//# sourceMappingURL=initializePgPool.d.ts.map