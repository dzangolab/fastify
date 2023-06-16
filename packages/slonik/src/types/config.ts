import type { ClientConfigurationInput, ConnectionOptions } from "slonik";

type SlonikConfig = {
  clientConfiguration?: ClientConfigurationInput;
  db: ConnectionOptions;
  migrations?: {
    packageMigrations?: string[];
    path: string;
  };
  pagination?: {
    defaultLimit: number;
    maxLimit: number;
  };
};

export type { SlonikConfig };
