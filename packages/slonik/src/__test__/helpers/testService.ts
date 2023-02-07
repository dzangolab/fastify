import BaseService from "../../service";

import type { Database, Service } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class TestService<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow
  >
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  /* eslint-enabled */
  static readonly TABLE = "test";
}

export default TestService;
