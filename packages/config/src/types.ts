export interface ApiConfig {
  appName: string;
  appOrigin: string[];
  baseUrl: string;
  env: string;
  graphql?: {
    enabled: boolean;
    path: string;
  };
  graphiql?: {
    enabled: boolean;
  };
  logger: {
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
  version: string;
}
