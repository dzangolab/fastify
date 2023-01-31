/* istanbul ignore file */
import SqlFactory from "../../sqlFactory";

import type { SlonikEnabledConfig } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class TestSqlFactory<
  Tenant extends QueryResultRow,
  TenantCreateInput extends QueryResultRow,
  TenantUpdateInput extends QueryResultRow
> extends SqlFactory<
  Tenant,
  TenantCreateInput,
  TenantUpdateInput
> {
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
