/* istanbul ignore file */
import type {
  MultiTenantConfig,
  MultiTenantEnabledConfig,
} from "../../../../types";

const createConfig = (multiTenantConfig?: MultiTenantConfig) => {
  const config: MultiTenantEnabledConfig = {
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
      pagination: {
        defaultLimit: 10,
        maxLimit: 50,
      },
    },
    multiTenant: multiTenantConfig,
  };

  return config;
};

export default createConfig;
