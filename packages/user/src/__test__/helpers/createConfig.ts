/* istanbul ignore file */
import "@dzangolab/fastify-mercurius";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { SlonikConfig } from "@dzangolab/fastify-slonik";

declare module "@dzangolab/fastify-config" {
  interface ApiConfig {
    slonik: SlonikConfig;
  }
}

const createConfig = (slonikConfig?: SlonikConfig) => {
  const config = {
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
    mercurius: {},
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
      ...slonikConfig,
    },
    user: {},
  } as ApiConfig;

  return config;
};

export default createConfig;
