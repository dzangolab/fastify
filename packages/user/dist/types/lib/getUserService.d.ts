import UserService from "../model/users/service";
import type { User, UserCreateInput, UserUpdateInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare const getUserService: (config: ApiConfig, slonik: Database, dbSchema?: string) => UserService<User & QueryResultRow, UserCreateInput, UserUpdateInput>;
export default getUserService;
//# sourceMappingURL=getUserService.d.ts.map