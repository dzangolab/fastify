import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class RoleSqlFactory<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow
  >
  extends DefaultSqlFactory<T, C, U>
  implements SqlFactory<T, C, U> {
  /* eslint-enabled */
}

export default RoleSqlFactory;
