/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import { TABLE_ORGANIZATIONS } from "../../constants";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class OrganizationsService<
    Organizations extends QueryResultRow,
    OrganizationsCreateInput extends QueryResultRow,
    OrganizationsUpdateInput extends QueryResultRow
  >
  extends BaseService<
    Organizations,
    OrganizationsCreateInput,
    OrganizationsUpdateInput
  >
  implements
    Service<Organizations, OrganizationsCreateInput, OrganizationsUpdateInput>
  {
  static readonly TABLE = TABLE_ORGANIZATIONS;
  static readonly LIMIT_DEFAULT = 20;
  static readonly LIMIT_MAX = 50;
}

export default OrganizationsService;
