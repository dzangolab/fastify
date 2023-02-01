/* istanbul ignore file */
import type {
  MultiTenantConfig,
  MultiTenantEnabledConfig,
} from "../../../../types";

const createConfig = (multiTenantConfig?: Partial<MultiTenantConfig>) => {
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
    multiTenant: {
      rootDomain: "example.test",
      ...multiTenantConfig,
    },
  };

  return config;
};

export default createConfig;
