import DefaultSqlFactory from "../../sqlFactory";

import type { SqlFactory } from "../../types/sqlFactory";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class TestSqlFactory<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow
  >
  extends DefaultSqlFactory<T, C, U>
  implements SqlFactory<T, C, U> {
  /* eslint-enabled */
}

export default TestSqlFactory;
