import type { ClientConfigurationInput, ConnectionOptions } from "slonik";

type SlonikOptions = {
  clientConfiguration?: ClientConfigurationInput;
  db: ConnectionOptions;
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
