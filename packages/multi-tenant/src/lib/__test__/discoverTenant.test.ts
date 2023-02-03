import { beforeEach, describe, expect, it, vi } from "vitest";

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
  domain: "valid.example.test",
  name: "Valid Tenant",
  slug: "valid",
};

describe("discoverTenant", async () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null if reserved domain", async () => {
    const database = createDatabase();

    expect(await discoverTenant(config, database, "admin.example.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null
    );
  });

  it("should return tenant if found", async () => {
    const database = createDatabase([tenant]);

    expect(await discoverTenant(config, database, "valid.example.test")).toBe(
      tenant
    );
  });

  // it("should throw error if tenant not present", async () => {
  //   vi.mock("../../model/tenants/service", () => {
  //     return {
  //       default: async () => ({findByHostname: vi.fn()})
  //     }
  //   });

  //   const database = createDatabase();

  //   expect(
  //     await discoverTenant(config, database, "invalid.example.test")
  //   ).toStrictEqual({});
  // });
});
