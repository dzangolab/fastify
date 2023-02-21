/* istanbul ignore file */
import type { MercuriusEnabledPlugin } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const schema = `
  type Query {
    test(x: Int, y: Int): Int
  }
`;

const resolvers = {
  Query: {
    test: async (_: unknown, { x, y }: { x: number; y: number }) => x + y,
  },
};

const createConfig = (plugins: MercuriusEnabledPlugin[]) => {
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
    mercurius: {
      enabled: true,
      graphiql: false,
      path: "/graphql",
      resolvers,
      schema,
      plugins,
    },
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
    },
  };

  return config;
};

export default createConfig;
