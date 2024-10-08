/* istanbul ignore file */
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { SlonikOptions } from "@dzangolab/fastify-slonik";

const createConfig = (slonikOptions?: SlonikOptions) => {
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
    graphql: {},
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
      ...slonikOptions,
    },
    user: {},
  } as ApiConfig;

  return config;
};

export default createConfig;
