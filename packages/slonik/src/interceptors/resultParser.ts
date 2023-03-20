import { SchemaValidationError, SerializableValue } from "slonik";

import type {
  Field,
  Interceptor,
  QueryResultRow,
  Query,
  QueryContext,
} from "slonik";

const createResultParser: Interceptor = {
  // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
  // Future versions of Zod will provide a more efficient parser when parsing without transformations.
  // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
  // transform results as needed in `transformRow`.
  transformRow: (
    /* eslint-disable @typescript-eslint/no-unused-vars */
    queryContext: QueryContext,
    query: Query,
    row: QueryResultRow,
    fields: readonly Field[]
    /* eslint-enable */
  ): QueryResultRow => {
    const { resultParser } = queryContext;

    if (!resultParser) {
      return row;
    }

    const validationResult = resultParser.safeParse(row);

    if (!validationResult.success) {
      throw new SchemaValidationError(
        query,
        row as SerializableValue,
        validationResult.error.issues
      );
    }

    return validationResult.data as QueryResultRow;
  },
};

export default createResultParser;
