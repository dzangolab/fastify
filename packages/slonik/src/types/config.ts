import type { ClientConfigurationInput, ConnectionOptions } from "slonik";

type SlonikOptions = {
  clientConfiguration?: ClientConfigurationInput;
  db: ConnectionOptions;
  enableQueryLogging?: boolean;
  migrations?: {
    path: string;
  };
  pagination?: {
    defaultLimit: number;
    maxLimit: number;
  };
};

type SlonikConfig = SlonikOptions;

export type { SlonikConfig, SlonikOptions };
