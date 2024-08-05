import { ApiConfig } from "@dzangolab/fastify-config";
import { Database } from "@dzangolab/fastify-slonik";
declare const runMigrations: (database: Database, config: ApiConfig) => Promise<void>;
export default runMigrations;
//# sourceMappingURL=runMigrations.d.ts.map