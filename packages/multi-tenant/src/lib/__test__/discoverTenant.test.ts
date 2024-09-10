import { describe, expect, it, vi } from "vitest";

import createConfig from "../../model/tenants/__test__/helpers/createConfig";
import createDatabase from "../../model/tenants/__test__/helpers/createDatabase";
import discoverTenant from "../discoverTenant";

import type { Tenant } from "../../types";

const config = createConfig({
  rootDomain: "example.test",
  reserved: {
    admin: {
      domains: ["example-admin.test"],
      enabled: true,
      slugs: ["admin"],
    },
    blacklisted: {
      domains: ["example-blacklisted.test"],
      enabled: true,
      slugs: ["blacklisted"],
    },
    others: {
      domains: ["example-others.test"],
      enabled: true,
      slugs: ["others"],
    },
    www: {
      domains: ["example-www.test"],
      enabled: true,
      slugs: ["www"],
    },
  },
});

const reservedDisabledConfig = createConfig({
  rootDomain: "example.test",
  reserved: {
    admin: {
      domains: ["example-admin.test"],
      enabled: false,
      slugs: ["admin"],
    },
    blacklisted: {
      domains: ["example-blacklisted.test"],
      enabled: false,
      slugs: ["blacklisted"],
    },
    others: {
      domains: ["example-others.test"],
      enabled: false,
      slugs: ["others"],
    },
    www: {
      domains: ["example-www.test"],
      enabled: false,
      slugs: ["www"],
    },
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
      null,
    );

    expect(await discoverTenant(config, database, "example-admin.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(
      await discoverTenant(config, database, "blacklisted.example.test"),
    ).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(
      await discoverTenant(config, database, "example-blacklisted.test"),
    ).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(await discoverTenant(config, database, "others.example.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(await discoverTenant(config, database, "example-others.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(await discoverTenant(config, database, "www.example.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );

    expect(await discoverTenant(config, database, "example-www.test")).toBe(
      // eslint-disable-next-line unicorn/no-null
      null,
    );
  });

  it("should return error if reserved is disabled", async () => {
    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "admin.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }

    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "example-admin.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }

    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "blacklisted.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }

    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "example-blacklisted.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }

    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "others.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }

    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "example-others.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }

    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "www.example.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }

    try {
      await discoverTenant(
        reservedDisabledConfig,
        database,
        "example-www.test",
      );

      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error.message).toBe("Tenant not found");
    }
  });

  it("should return tenant if found", async () => {
    expect(await discoverTenant(config, database, "valid.example.test")).toBe(
      tenant,
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
