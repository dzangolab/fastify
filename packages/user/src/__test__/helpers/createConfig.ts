/* istanbul ignore file */
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { SlonikConfig } from "@dzangolab/fastify-slonik";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    slonik: SlonikConfig;
  }
}

const createConfig = (slonikConfig?: SlonikConfig) => {
  const config: ApiConfig = {
    appName: "app",
    appOrigin: ["http://localhost"],
    baseUrl: "http://localhost",
    env: "development",
    logger: {
      level: "debug",
    },
    mercurius: {},
    name: "Test",
    port: 3000,
    protocol: "http",
    rest: {
      enabled: true,
    },
    version: "0.1",
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
      ...slonikConfig,
    },
  };

  return config;
};

export default createConfig;
