/* istanbul ignore file */
import type { MultiTenantConfig } from "../../../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    multiTenant?: MultiTenantConfig;
  }
}

const createConfig = (multiTenantConfig?: Partial<MultiTenantConfig>) => {
  const config: ApiConfig = {
    appName: "app",
    appOrigin: ["http://localhost"],
    baseUrl: "http://localhost",
    env: "development",
    logger: {
      level: "debug",
    },
    multiTenant: { ...multiTenantConfig },
    name: "Test",
    port: 3000,
    protocol: "http",
    rest: {
      enabled: true,
    },
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
    },
    version: "0.1",
  };

  return config;
};

export default createConfig;
