import type { User } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { SqlTaggedTemplate } from "slonik";
declare const Service: (config: ApiConfig, database: Database, sql: SqlTaggedTemplate) => {
    findById: (id: string) => Promise<User | null>;
    list: (limit?: number | undefined, offset?: number) => Promise<readonly User[]>;
};
export default Service;
//# sourceMappingURL=service.d.ts.map