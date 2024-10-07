import type { ClientConfigurationInput, ConnectionOptions } from "slonik";

type SlonikConfig = {
  clientConfiguration?: ClientConfigurationInput;
  db: ConnectionOptions;
  migrations?: {
    path: string;
    package?: boolean;
  };
  pagination?: {
    defaultLimit: number;
    maxLimit: number;
  };
};

type SlonikOptions = SlonikConfig;

export type { SlonikConfig, SlonikOptions };
