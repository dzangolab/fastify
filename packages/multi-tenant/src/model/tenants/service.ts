import { BaseService } from "@dzangolab/fastify-slonik";

import SqlFactory from "./sqlFactory";
import getAllReservedDomains from "../../lib/getAllReservedDomains";
import getAllReservedSlugs from "../../lib/getAllReservedSlugs";
import getDatabaseConfig from "../../lib/getDatabaseConfig";
import getMultiTenantConfig from "../../lib/getMultiTenantConfig";
import runMigrations from "../../lib/runMigrations";
import { validateTenantInput } from "../../lib/validateTenantSchema";

import type { Tenant as BaseTenant } from "../../types";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class TenantService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends BaseService<T, C, U> {
  protected _ownerId: string | undefined = undefined;

  async all(fields: string[]): Promise<readonly T[]> {
    const query = this.factory.getAllWithAliasesSql(fields);

    const tenants = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return tenants as T[];
  }

  async create(data: C): Promise<T | undefined> {
    const multiTenantConfig = getMultiTenantConfig(this.config);

    const { slug: slugColumn, domain: domainColumn } =
      multiTenantConfig.table.columns;

    // This handles the empty string issue.
    if (data[domainColumn] === "") {
      delete data[domainColumn];
    }

    validateTenantInput(this.config, data);

    if (getAllReservedSlugs(this.config).includes(data[slugColumn] as string)) {
      throw {
        name: "ERROR_RESERVED_SLUG",
        message: `The requested ${slugColumn} "${data[slugColumn]}" is reserved and cannot be used`,
        statusCode: 422,
      };
    }

    if (
      getAllReservedDomains(this.config).includes(data[domainColumn] as string)
    ) {
      throw {
        name: "ERROR_RESERVED_DOMAIN",
        message: `The requested ${domainColumn} "${data[domainColumn]}" is reserved and cannot be used`,
        statusCode: 422,
      };
    }

    await this.validateSlugOrDomain(
      data[slugColumn] as string,
      data[domainColumn] as string,
    );

    const query = this.factory.getCreateSql(data);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as T;

    return result ? this.postCreate(result) : undefined;
  }

  async findByHostname(hostname: string): Promise<T | null> {
    const query = this.factory.getFindByHostnameSql(
      hostname,
      this.config.multiTenant.rootDomain,
    );

    const tenant = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return tenant;
  }

  async validateSlugOrDomain(slug: string, domain?: string) {
    const query = this.factory.getFindBySlugOrDomainSql(slug, domain);

    const tenants = await this.database.connect(async (connection) => {
      return connection.any(query);
    });

    if (tenants.length > 0) {
      const multiTenantConfig = getMultiTenantConfig(this.config);

      const { slug: slugColumn, domain: domainColumn } =
        multiTenantConfig.table.columns;

      if (tenants.some((tenant) => tenant[slugColumn] === slug)) {
        throw {
          name: "ERROR_SLUG_ALREADY_EXISTS",
          message: `The specified ${slugColumn} "${slug}" already exits`,
          statusCode: 422,
        };
      }

      throw {
        name: "ERROR_DOMAIN_ALREADY_EXISTS",
        message: `The specified ${domainColumn} "${domain}" already exits`,
        statusCode: 422,
      };
    }
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new SqlFactory<T, C, U>(this);
    }

    return this._factory as SqlFactory<T, C, U>;
  }

  get sortKey(): string {
    return this.config.multiTenant.table?.columns?.id || super.sortKey;
  }

  get ownerId() {
    return this._ownerId;
  }

  set ownerId(ownerId: string | undefined) {
    this._ownerId = ownerId;
  }

  get table() {
    return this.config.multiTenant?.table?.name || "tenants";
  }

  protected async postCreate(tenant: T): Promise<T> {
    const multiTenantConfig = getMultiTenantConfig(this.config);

    await runMigrations(
      getDatabaseConfig(this.config.slonik),
      multiTenantConfig.migrations.path,
      tenant as BaseTenant,
    );

    return tenant;
  }
}

export default TenantService;
