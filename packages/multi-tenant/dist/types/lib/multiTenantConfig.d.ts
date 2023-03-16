import type { ApiConfig } from "@dzangolab/fastify-config";
declare const getMultiTenantConfig: (config: ApiConfig) => {
    migrations: {
        path: string;
    };
    reserved: {
        domains: string[];
        slugs: string[];
    };
    table: {
        name: string;
        columns: {
            id: string;
            name: string;
            slug: string;
            domain: string;
        };
    };
};
export default getMultiTenantConfig;
//# sourceMappingURL=multiTenantConfig.d.ts.map