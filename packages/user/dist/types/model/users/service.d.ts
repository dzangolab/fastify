import type { UserProfile } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Tenant } from "@dzangolab/fastify-multi-tenant";
import type { Database } from "@dzangolab/fastify-slonik";
declare class UserService {
    config: ApiConfig;
    database: Database;
    constructor(config: ApiConfig, database: Database);
    changePassword: (userId: string, oldPassword: string, newPassword: string, tenant?: Tenant) => Promise<{
        status: string;
        message: string;
    } | {
        status: string;
        message?: undefined;
    }>;
    getUserById: (userId: string, tenant?: Tenant) => Promise<{
        email: string | undefined;
        id: string;
        profile: UserProfile | null;
        roles: string[];
        timeJoined: number | undefined;
    }>;
}
export default UserService;
//# sourceMappingURL=service.d.ts.map