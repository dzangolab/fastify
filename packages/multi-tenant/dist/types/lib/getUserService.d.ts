import { UserService } from "@dzangolab/fastify-user";
import type { Tenant } from "../types/tenant";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { User } from "@dzangolab/fastify-user";
import type { QueryResultRow } from "slonik";
declare const getUserService: (config: ApiConfig, slonik: Database, tenant?: Tenant) => UserService<User & QueryResultRow, Partial<Omit<User, "roles">>, Partial<Omit<User, "id" | "roles">>>;
export default getUserService;
//# sourceMappingURL=getUserService.d.ts.map