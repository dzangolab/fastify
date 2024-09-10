import humps from "humps";

import type {
  Field,
  Interceptor,
  Query,
  QueryContext,
  QueryResultRow,
} from "slonik";

const fieldNameCaseConverter: Interceptor = {
  transformRow: (
    /* eslint-disable @typescript-eslint/no-unused-vars */
    queryContext: QueryContext,
    query: Query,
    row: QueryResultRow,
    fields: readonly Field[]
    /* eslint-enable */
  ): QueryResultRow => {
    return humps.camelizeKeys(row) as QueryResultRow;
  },
};

export default fieldNameCaseConverter;
