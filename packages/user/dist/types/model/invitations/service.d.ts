import { BaseService } from "@dzangolab/fastify-slonik";
import InvitationSqlFactory from "./sqlFactory";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class InvitationService<Invitation extends QueryResultRow, InvitationCreateInput extends QueryResultRow, InvitationUpdateInput extends QueryResultRow> extends BaseService<Invitation, InvitationCreateInput, InvitationUpdateInput> implements Service<Invitation, InvitationCreateInput, InvitationUpdateInput> {
    static readonly TABLE = "invitations";
    create: (data: InvitationCreateInput) => Promise<Invitation | undefined>;
    findByToken: (token: string) => Promise<Invitation | null>;
    get factory(): InvitationSqlFactory<Invitation, InvitationCreateInput, InvitationUpdateInput>;
    protected validateUUID: (uuid: string) => boolean;
}
export default InvitationService;
//# sourceMappingURL=service.d.ts.map