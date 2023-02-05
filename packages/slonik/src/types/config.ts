import type { ConnectionOptions } from "slonik";
import type { ClientConfigurationInput } from "slonik/dist/src/types";

type SlonikConfig = {
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

export type { SlonikConfig };
