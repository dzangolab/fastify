/* istanbul ignore file */
import type { SlonikConfig } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

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
