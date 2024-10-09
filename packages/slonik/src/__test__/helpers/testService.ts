import BaseService from "../../service";

import type { Service } from "../../types";
import type { QueryResultRow } from "slonik";

class TestService<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  /* eslint-enabled */
  static readonly TABLE = "test";
}

export default TestService;
