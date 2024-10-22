/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import Service from "../service";
import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";
import TestSqlFactory from "./helpers/sqlFactory";

describe("Tenant Sql Factory", () => {
  const database = createDatabase();

  it("initiates default field mappings", () => {
    const config = createConfig({
      rootDomain: "app.test",
    });

    const service = new Service(config, database);

    const factory = new TestSqlFactory(service);

    expect(Object.fromEntries(factory.getFieldMappings())).toEqual({
      domain: "domain",
      id: "id",
      name: "name",
      ownerId: "owner_id",
      slug: "slug",
    });
  });

  it("initiates field mappings from config", () => {
    const columns = {
      domain: "tenant_domain",
      id: "tenant_id",
      name: "tenant_name",
      ownerId: "tenant_owner_id",
      slug: "tenant_slug",
    };

    const config = createConfig({
      rootDomain: "app.test",
      table: {
        columns: columns,
      },
    });

    const service = new Service(config, database);

    const factory = new TestSqlFactory(service);

    expect(Object.fromEntries(factory.getFieldMappings())).toEqual(columns);
  });

  it("returns an aliased field", () => {
    const columns = {
      domain: "domain",
      id: "tenant_id",
      name: "tenant_name",
      tenantId: "tenant_tenant_id",
      slug: "tenant_slug",
    };

    const config = createConfig({
      rootDomain: "app.test",
      table: {
        columns: columns,
      },
    });

    const service = new Service(config, database);

    const factory = new TestSqlFactory(service);

    for (const column in columns) {
      const field = column as keyof typeof columns;

      const mapped = factory.getMappedFieldPublic(field);

      if (mapped === field) {
        expect(factory.getAliasedFieldPublic(field)).toEqual({
          names: [field],
          type: Symbol.for("SLONIK_TOKEN_IDENTIFIER"),
        });
      } else {
        expect(factory.getAliasedFieldPublic(field)).toEqual({
          glue: {
            sql: " AS ",
            type: Symbol.for("SLONIK_TOKEN_FRAGMENT"),
            values: [],
          },
          members: [
            {
              names: [mapped],
              type: Symbol.for("SLONIK_TOKEN_IDENTIFIER"),
            },
            {
              names: [field],
              type: Symbol.for("SLONIK_TOKEN_IDENTIFIER"),
            },
          ],
          type: Symbol.for("SLONIK_TOKEN_LIST"),
        });
      }
    }
  });

  it("returns a mapped field", () => {
    const columns = {
      domain: "tenant_domain",
      id: "tenant_id",
      name: "tenant_name",
      createdBy: "tenant_created_by",
      slug: "tenant_slug",
    };

    const config = createConfig({
      rootDomain: "app.test",
      table: {
        columns: columns,
      },
    });

    const service = new Service(config, database);

    const factory = new TestSqlFactory(service);

    for (const column in columns) {
      const field = column as keyof typeof columns;
      expect(factory.getMappedFieldPublic(field)).toEqual(columns[field]);
    }
  });
});
