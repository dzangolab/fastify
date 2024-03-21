/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";
import Service from "../service";

describe("Tenant Service", () => {
  const database = createDatabase();

  it("has a default tablename of 'tenants'", () => {
    const config = createConfig({
      rootDomain: "app.test",
    });

    const service = new Service(config, database);

    expect(service.table).toBe("tenants");
  });

  it("has a tablename as per config", () => {
    const table = "accounts";

    const config = createConfig({
      rootDomain: "app.test",
      table: {
        name: table,
      },
    });

    const service = new Service(config, database);

    expect(service.table).toBe(table);
  });

  it("has a default schema of 'public'", () => {
    const config = createConfig({
      rootDomain: "app.test",
    });

    const service = new Service(config, database);

    expect(service.schema).toBe("public");
  });
});
