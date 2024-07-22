/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import { TABLE_ORGANIZATIONS } from "../../constants";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class OrganizationService<
    Organization extends QueryResultRow,
    OrganizationCreateInput extends QueryResultRow,
    OrganizationUpdateInput extends QueryResultRow
  >
  extends BaseService<
    Organization,
    OrganizationCreateInput,
    OrganizationUpdateInput
  >
  implements
    Service<Organization, OrganizationCreateInput, OrganizationUpdateInput>
  {
  static readonly TABLE = TABLE_ORGANIZATIONS;
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;
}

export default OrganizationService;
