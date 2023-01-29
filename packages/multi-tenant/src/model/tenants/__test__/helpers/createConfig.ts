import type {
  MultiTenantConfig,
  MultiTenantEnabledConfig,
} from "../../../../types";

const createConfig = (multiTenantConfig?: MultiTenantConfig) => {
  const config: MultiTenantEnabledConfig = {
    pagination: {
      default_limit: 10,
      max_limit: 50,
    },
    slonik: {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
    },
    multiTenant: multiTenantConfig,
  };

  return config;
};

export default createConfig;
