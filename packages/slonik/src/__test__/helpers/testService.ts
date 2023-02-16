import SqlFactory from "./sqlFactory";
import BaseService from "../../service";

import type { Service } from "../../types";
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

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new SqlFactory<T, C, U>(this);
    }

    return this._factory as SqlFactory<T, C, U>;
  }
}

export default TestService;
