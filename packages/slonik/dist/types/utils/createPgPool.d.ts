import * as pg from "pg";
import { MigrateDBConfig } from "postgres-migrations";
declare const createPgPool: (migrateDatabaseConfig: MigrateDBConfig) => Promise<pg.Client>;
export default createPgPool;
//# sourceMappingURL=createPgPool.d.ts.map