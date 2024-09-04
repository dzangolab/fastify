import { BaseService } from "@dzangolab/fastify-slonik";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class OrganizationService<Organization extends QueryResultRow, OrganizationCreateInput extends QueryResultRow, OrganizationUpdateInput extends QueryResultRow> extends BaseService<Organization, OrganizationCreateInput, OrganizationUpdateInput> implements Service<Organization, OrganizationCreateInput, OrganizationUpdateInput> {
    static readonly TABLE = "organizations";
}
export default OrganizationService;
//# sourceMappingURL=service.d.ts.map