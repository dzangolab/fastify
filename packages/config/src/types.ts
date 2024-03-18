import type { LoggerOptions, MultiStreamRes } from "pino";

interface AppConfig {
  id: number;
  name: string;
  origin: string;
  supportedRoles: string[];
}

export type Compressor = (source: string, destination: string) => string;
interface ApiConfig {
  appName: string;
  appOrigin: string[];
  apps?: AppConfig[];
  baseUrl: string;
  env: string;
  logger: {
    level: LoggerOptions["level"];
    base?: LoggerOptions["base"];
    formatters?: LoggerOptions["formatters"];
    timestamp?: LoggerOptions["timestamp"];
    streams?: MultiStreamRes;
    rotation?: {
      enabled: boolean;
      options: {
        filenames: string[];
        path: string;
        interval?: string;
        maxFiles?: number;
        maxSize?: string;
        compress?: boolean | string | Compressor;
        size?: string;
      };
    };
    prettyTransport?: {
      options: {
        colorize: boolean;
        ignore: string;
        translateTime: string;
      };
    };
  };
  name: string;
  pagination?: {
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

export type { ApiConfig, AppConfig };
