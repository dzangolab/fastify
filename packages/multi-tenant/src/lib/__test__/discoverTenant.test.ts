import { describe, expect, it } from "vitest";

import createDatabase from "./helpers/createDatabase";
import createConfig from "../../model/tenants/__test__/helpers/createConfig";
import discoverTenant from "../discoverTenant";

const config = createConfig({
  rootDomain: "example.test",
  reserved: {
    slugs: ["admin"],
  },
});

const tenant = {
  id: 1,
  domain: "tenant1.example.test",
  name: "Tenant 1",
  slug: "tenant1",
};

describe("discoverTenant", async () => {
  it("should return null if reserved domain", async () => {
    const database = createDatabase();

    expect(await discoverTenant(config, database, "admin.example.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null
    );
  });

  it("should return tenant if found", async () => {
    const database = createDatabase([tenant]);

    expect(await discoverTenant(config, database, "tenant1.example.test")).toBe(
      tenant
    );
  });

  // it("should throw error if tenant not present", async () => {
  //   const database = createDatabase();

  //   expect(
  //     await discoverTenant(config, database, "tenant1.example.test")
  //   ).toThrowError();
  // });
});
