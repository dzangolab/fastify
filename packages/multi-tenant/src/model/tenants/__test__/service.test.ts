/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";
import Service from "../service";

describe("Tenant Service", () => {
  const database = createDatabase();

  it("initiates default field mappings", () => {
    const config = createConfig();

    const service = new Service(config, database, "tenants");

    expect(Object.fromEntries(service.getFieldMappings())).toEqual({
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
      table: {
        columns: columns,
      },
    });

    const service = new Service(config, database, "tenants");

    expect(Object.fromEntries(service.getFieldMappings())).toEqual(columns);
  });

  it("returns an aliased field", () => {
    const columns = {
      domain: "domain",
      id: "tenant_id",
      name: "tenant_name",
      slug: "tenant_slug",
    };

    const config = createConfig({
      table: {
        columns: columns,
      },
    });

    const service = new Service(config, database, "tenants");

    for (const column in columns) {
      const field = column as keyof typeof columns;

      const mapped = service.getMappedFieldPublic(field);

      const expected = mapped === field ? field : `${mapped} AS ${field}`;

      expect(service.getAliasedFieldPublic(field)).toEqual({
        names: [expected],
        type: "SLONIK_TOKEN_IDENTIFIER",
      });
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
      table: {
        columns: columns,
      },
    });

    const service = new Service(config, "tenants");

    for (const column in columns) {
      const field = column as keyof typeof columns;
      expect(service.getMappedFieldPublic(field)).toEqual(columns[field]);
    }
  });
});
