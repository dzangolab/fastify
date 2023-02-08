import fieldNameCaseConverter from "../interceptors/fieldNameCaseConverter";

import type { ClientConfigurationInput } from "slonik/dist/src/types";

const createClientConfiguration = (
  config?: ClientConfigurationInput
): ClientConfigurationInput => {
  const configuration = {
    captureStackTrace: false,
    connectionRetryLimit: 3,
    connectionTimeout: 5000,
    idleInTransactionSessionTimeout: 60000,
    idleTimeout: 5000,
    interceptors: [],
    maximumPoolSize: 10,
    queryRetryLimit: 5,
    statementTimeout: 60000,
    transactionRetryLimit: 5,

    ...config,
  };

  configuration.interceptors = [
    fieldNameCaseConverter,
    ...(config?.interceptors ?? []),
  ];

  return configuration;
};

export default createClientConfiguration;
