import type { ClientConfigurationInput, ConnectionOptions } from "slonik";

type SlonikConfig = {
  clientConfiguration?: ClientConfigurationInput;
  db: ConnectionOptions;
  migrations?: {
    customMigrations?: string[];
    path: string;
  };
  pagination?: {
    defaultLimit: number;
    maxLimit: number;
  };
};

export type { SlonikConfig };
