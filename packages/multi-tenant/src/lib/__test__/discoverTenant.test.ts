import { describe, expect, it, vi } from "vitest";

import createConfig from "../../model/tenants/__test__/helpers/createConfig";
import createDatabase from "../../model/tenants/__test__/helpers/createDatabase";
import discoverTenant from "../discoverTenant";

import type { Tenant } from "../../types";

const config = createConfig({
  rootDomain: "example.test",
  reserved: {
    slugs: ["admin"],
  },
});

const database = createDatabase();

const tenant = {
  id: 1,
  domain: "valid.example.test",
  name: "Valid Tenant",
  slug: "valid",
} as unknown as Tenant;

vi.mock("../../model/tenants/service", () => {
  return {
    default: vi.fn(() => ({
      findByHostname: async (domain: string) => {
        if (domain === "valid.example.test") {
          return tenant;
        }

        // eslint-disable-next-line unicorn/no-null
        return null;
      },
    })),
  };
});

describe.concurrent("discoverTenant", () => {
  it("should return null if reserved domain", async () => {
    expect(await discoverTenant(config, database, "admin.example.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null
    );
  });

  it("should return tenant if found", async () => {
    expect(await discoverTenant(config, database, "valid.example.test")).toBe(
      tenant
    );
  });

  it("should throw error if no such tenant exists", async () => {
    try {
      await discoverTenant(config, database, "invalid.example.test");

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }
  });
});
