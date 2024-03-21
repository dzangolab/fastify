import { createTypeParserPreset } from "slonik";

import fieldNameCaseConverter from "../interceptors/fieldNameCaseConverter";
import resultParser from "../interceptors/resultParser";
import { createBigintTypeParser } from "../typeParsers/createBigintTypeParser";

import type { ClientConfigurationInput } from "slonik";

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
    typeParsers: [...createTypeParserPreset(), createBigintTypeParser()],

    ...config,
  };

  configuration.interceptors = [
    fieldNameCaseConverter,
    resultParser,
    ...(config?.interceptors ?? []),
  ];

  return configuration;
};

export default createClientConfiguration;
