import { formatDate, BaseService } from "@dzangolab/fastify-slonik";

import InvitationSqlFactory from "./sqlFactory";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../../types";
import type { FilterInput } from "@dzangolab/fastify-slonik";

class InvitationService extends BaseService<
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput
> {
  async create(data: InvitationCreateInput): Promise<Invitation | undefined> {
    const filters = {
      AND: [
        { key: "email", operator: "eq", value: data.email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: formatDate(new Date()) },
        { key: "revokedAt", operator: "eq", value: "null" },
      ],
    } as FilterInput;

    const validInvitationCount = await this.count(filters);

    // only one valid invitation is allowed per email
    if (validInvitationCount > 0) {
      throw new Error("Invitation already exist");
    }

    const query = this.factory.getCreateSql(this.filterValueExpressions(data));

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Invitation;

    return result ? this.postCreate(result) : undefined;
  }

  async findByToken(token: string): Promise<Invitation | null> {
    if (!this.validateUUID(token)) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    const query = this.factory.getFindByTokenSql(token);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  }

  get factory() {
    if (!this._factory) {
      this._factory = new InvitationSqlFactory(
        this.config,
        this.database,
        this.schema,
      );
    }

    return this._factory as InvitationSqlFactory;
  }

  protected validateUUID(uuid: string): boolean {
    const regexp = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;

    return regexp.test(uuid);
  }
}

export default InvitationService;
