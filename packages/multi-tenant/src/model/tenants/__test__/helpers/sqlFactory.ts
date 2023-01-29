/* istanbul ignore file */
import SqlFactory from "../../sqlFactory";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { MultiTenantEnabledConfig } from "../../../../types";
import type { SlonikEnabledConfig } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class TestSqlFactory<
  MultiTenantEnabledConfig extends SlonikEnabledConfig,
  Tenant extends QueryResultRow,
  TenantCreateInput extends QueryResultRow,
  TenantUpdateInput extends QueryResultRow
> extends SqlFactory<
  MultiTenantEnabledConfig,
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
