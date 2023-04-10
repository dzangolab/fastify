import type { ClientConfigurationInput, ConnectionOptions } from "slonik";
type SlonikConfig = {
    clientConfiguration?: ClientConfigurationInput;
    db: ConnectionOptions;
    migrations?: {
        path: string;
    };
    pagination?: {
        defaultLimit: number;
        maxLimit: number;
    };
};
export type { SlonikConfig };
//# sourceMappingURL=config.d.ts.map