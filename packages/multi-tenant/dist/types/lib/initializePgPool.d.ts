import * as pg from "pg";
import type { ClientConfig } from "pg";
declare const initializePgPool: (databaseConfig: ClientConfig) => Promise<pg.Client>;
export default initializePgPool;
//# sourceMappingURL=initializePgPool.d.ts.map