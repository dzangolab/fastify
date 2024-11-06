/* istanbul ignore file */
import { createTypeParserPreset } from "slonik";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";
import { describe, expect, it } from "vitest";

import fieldNameCaseConverter from "../../interceptors/fieldNameCaseConverter";
import resultParser from "../../interceptors/resultParser";
import { createBigintTypeParser } from "../../typeParsers/createBigintTypeParser";
import createClientConfiguration from "../createClientConfiguration";

import type { Query, QueryContext } from "slonik";

describe("createClientConfiguration helper", () => {
  const defaultConfiguration = {
    captureStackTrace: false,
    connectionRetryLimit: 3,
    connectionTimeout: 5000,
    idleInTransactionSessionTimeout: 60000,
    idleTimeout: 5000,
    interceptors: [
      fieldNameCaseConverter,
      resultParser,
      createQueryLoggingInterceptor(),
    ],
    maximumPoolSize: 10,
    queryRetryLimit: 5,
    statementTimeout: 60000,
    transactionRetryLimit: 5,
    typeParsers: [...createTypeParserPreset(), createBigintTypeParser()],
  };

  it("creates default configuration", () => {
    const configuration = createClientConfiguration();

    expect(configuration).toEqual(defaultConfiguration);
  });

  it("includes fieldNameCaseConvertor interceptor", () => {
    const interceptor = {
      transformQuery: (context: QueryContext, query: Query): Query => {
        return query;
      },
    };

    const configuration = createClientConfiguration({
      interceptors: [interceptor],
    });

    expect(configuration.interceptors).toContain(fieldNameCaseConverter);
  });
});
