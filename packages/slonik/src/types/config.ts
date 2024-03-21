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

export type { SlonikConfig };
