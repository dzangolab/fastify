import { ApiConfig } from "@dzangolab/fastify-config";
import { QuerySqlToken } from "slonik";
import { ZodTypeAny } from "zod";
declare const queryToCreateTable: (config: ApiConfig) => QuerySqlToken<ZodTypeAny>;
export default queryToCreateTable;
//# sourceMappingURL=queryToCreateTable.d.ts.map