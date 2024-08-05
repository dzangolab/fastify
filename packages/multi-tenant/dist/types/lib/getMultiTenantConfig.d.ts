import type { ApiConfig } from "@dzangolab/fastify-config";
declare const getMultiTenantConfig: (config: ApiConfig) => {
    migrations: {
        path: string;
    };
    reserved: {
        admin: {
            domains: string[];
            enabled: boolean;
            slugs: string[];
        };
        blacklisted: {
            domains: string[];
            enabled: boolean;
            slugs: string[];
        };
        others: {
            domains: string[];
            enabled: boolean;
            slugs: string[];
        };
        www: {
            domains: string[];
            enabled: boolean;
            slugs: string[];
        };
    };
    table: {
        name: string;
        columns: {
            id: string;
            domain: string;
            name: string;
            ownerId: string;
            slug: string;
        };
    };
};
export default getMultiTenantConfig;
//# sourceMappingURL=getMultiTenantConfig.d.ts.map