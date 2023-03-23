import { sql } from "slonik";
import type { DatabasePool } from "slonik";
import type { ClientConfigurationInput, ConnectionRoutine, QueryFunction } from "slonik/dist/src/types";
type SlonikOptions = {
    connectionString: string;
    clientConfiguration?: ClientConfigurationInput;
};
declare module "fastify" {
    interface FastifyRequest {
        slonik: {
            connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
            pool: DatabasePool;
            query: QueryFunction;
        };
        sql: typeof sql;
    }
    interface FastifyInstance {
        slonik: {
            connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
            pool: DatabasePool;
            query: QueryFunction;
        };
        sql: typeof sql;
    }
}
export declare const fastifySlonik: import("fastify").FastifyPluginAsync<SlonikOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
declare const _default: import("fastify").FastifyPluginAsync<SlonikOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
export default _default;
//# sourceMappingURL=slonik.d.ts.map