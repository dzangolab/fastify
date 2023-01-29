/* istanbul ignore file */
import type { SlonikConfig, SlonikEnabledConfig } from "../../types";

const createConfig = (slonikConfig?: SlonikConfig) => {
  const config: SlonikEnabledConfig = {
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
      ...slonikConfig,
    },
  };

  return config;
};

export default createConfig;
