/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import fieldNameCaseConverter from "../../interceptors/fieldNameCaseConverter";
import resultParserInterceptor from "../../interceptors/resultParserInterceptor";
import createClientConfiguration from "../createClientConfiguration";

import type { Query, QueryContext } from "slonik";

describe("createClientConfiguration helper", () => {
  const defaultConfiguration = {
    captureStackTrace: false,
    connectionRetryLimit: 3,
    connectionTimeout: 5000,
    idleInTransactionSessionTimeout: 60000,
    idleTimeout: 5000,
    interceptors: [fieldNameCaseConverter, resultParserInterceptor],
    maximumPoolSize: 10,
    queryRetryLimit: 5,
    statementTimeout: 60000,
    transactionRetryLimit: 5,
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
