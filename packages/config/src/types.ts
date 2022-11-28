export interface ApiConfig {
  appName: string;
  appOrigin: string[];
  baseUrl: string;
  db: {
    acquireConnectionTimeout: number;
    databaseName: string;
    debug: boolean;
    host: string;
    password: string;
    port: number;
    username: string;
  };
  env: string;
  graphql: {
    enabled: boolean;
    path: string;
  };
  graphiql: {
    enabled: boolean;
  };
  logger?: {
    level: string;
    transport?: {
      target: string;
      options: {
        colorize: boolean;
        ignore: string;
        translateTime: string;
      };
    };
  };
  logLevel?: string;
  name: string;
  pagination: {
    default_limit: number;
    max_limit: number;
  };
  port: number;
  protocol: string;
  rest: {
    enabled: boolean;
  };
  supertokens: {
    connectionUri: string;
    providers?: {
      google: {
        client_id: string;
        client_secret: string;
      };
    };
  };
  version: string;
}
