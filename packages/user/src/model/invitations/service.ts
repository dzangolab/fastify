import { formatDate, BaseService } from "@dzangolab/fastify-slonik";

import InvitationSqlFactory from "./sqlFactory";
import { TABLE_INVITATIONS } from "../../constants";

import type { FilterInput } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class InvitationService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends BaseService<T, C, U> {
  static readonly TABLE = TABLE_INVITATIONS;

  async create(data: C): Promise<T | undefined> {
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

    const query = this.factory.getCreateSql(data);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as T;

    return result ? this.postCreate(result) : undefined;
  }

  async findByToken(token: string): Promise<T | null> {
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
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new InvitationSqlFactory<T, C, U>(this);
    }

    return this._factory as InvitationSqlFactory<T, C, U>;
  }

  protected validateUUID(uuid: string): boolean {
    const regexp = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;

    return regexp.test(uuid);
  }
}

export default InvitationService;
