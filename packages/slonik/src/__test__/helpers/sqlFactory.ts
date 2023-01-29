/* istanbul ignore file */
import SqlFactory from "../../sqlFactory";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { SlonikEnabledConfig } from "../../types";
import type { QueryResultRow } from "slonik";

interface Test {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

type TestCreateInput = Partial<Omit<Test, "id" | "createdAt" | "updatedAt">>;
type TestUpdateInput = Partial<Omit<Test, "id" | "createdAt" | "updatedAt">>;

class TestSqlFactory<
  Config extends SlonikEnabledConfig,
  Test extends QueryResultRow,
  TestCreateInput extends QueryResultRow,
  TestUpdateInput extends QueryResultRow
> extends SqlFactory<Config, Test, TestCreateInput, TestUpdateInput> {
  getDefaultLimitPublic = () => {
    return this.getDefaultLimit();
  };

  getMaxLimitPublic = () => {
    return this.getMaxLimit();
  };
}

export default TestSqlFactory;
