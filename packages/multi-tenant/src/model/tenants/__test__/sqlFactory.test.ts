/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";
import TestSqlFactory from "./helpers/sqlFactory";
import Service from "../service";

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
      slug: "slug",
    });
  });

  it("initiates field mappings from config", () => {
    const columns = {
      domain: "tenant_domain",
      id: "tenant_id",
      name: "tenant_name",
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
          type: "SLONIK_TOKEN_IDENTIFIER",
        });
      } else {
        expect(factory.getAliasedFieldPublic(field)).toEqual({
          glue: {
            sql: " AS ",
            type: "SLONIK_TOKEN_SQL",
            values: [],
          },
          members: [
            {
              names: [mapped],
              type: "SLONIK_TOKEN_IDENTIFIER",
            },
            {
              names: [field],
              type: "SLONIK_TOKEN_IDENTIFIER",
            },
          ],
          type: "SLONIK_TOKEN_LIST",
        });
      }
    }
  });

  it("returns a mapped field", () => {
    const columns = {
      domain: "tenant_domain",
      id: "tenant_id",
      name: "tenant_name",
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
