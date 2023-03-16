import { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
declare const discoverTenant: (config: ApiConfig, database: Database, host: string) => Promise<import("slonik").QueryResultRow | null>;
export default discoverTenant;
//# sourceMappingURL=discoverTenant.d.ts.map