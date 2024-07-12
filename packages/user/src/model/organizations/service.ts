import { BaseService } from "@dzangolab/fastify-slonik";

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
    Service<
      Organizations,
      OrganizationsCreateInput,
      OrganizationsUpdateInput
    > {}

export default OrganizationsService;
