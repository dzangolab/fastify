/* istanbul ignore file */
import TenantSqlFactory from "../../sqlFactory";

import type { QueryResultRow } from "slonik";

class TestSqlFactory<
  Tenant extends QueryResultRow,
  TenantCreateInput extends QueryResultRow,
  TenantUpdateInput extends QueryResultRow,
> extends TenantSqlFactory<Tenant, TenantCreateInput, TenantUpdateInput> {
  getFieldMappings = () => {
    return this.fieldMappings;
  };

  getMappedFieldPublic = (field: string) => {
    return this.getMappedField(field);
  };

  getAliasedFieldPublic = (field: string) => {
    return this.getAliasedField(field);
  };
}

export default TestSqlFactory;
