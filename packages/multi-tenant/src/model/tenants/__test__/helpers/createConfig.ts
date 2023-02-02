/* istanbul ignore file */
import { ApiConfig } from "@dzangolab/fastify-config";

import type { MultiTenantConfig } from "../../../../types";

const createConfig = (multiTenantConfig?: Partial<MultiTenantConfig>) => {
  const config = {
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

  return config as ApiConfig;
};

export default createConfig;
