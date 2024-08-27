import type { Tenant } from "../types/tenant";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
declare const getUserService: (config: ApiConfig, slonik: Database, tenant?: Tenant) => import("@dzangolab/fastify-user/dist/types/model/users/service").default<import("@dzangolab/fastify-user/dist/types/types").User & import("slonik").QueryResultRow, import("@dzangolab/fastify-user/dist/types/types").UserCreateInput, import("@dzangolab/fastify-user/dist/types/types").UserUpdateInput>;
export default getUserService;
//# sourceMappingURL=getUserService.d.ts.map