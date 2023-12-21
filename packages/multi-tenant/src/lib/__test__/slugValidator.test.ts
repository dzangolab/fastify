import { describe, expect, it } from "vitest";

import createConfig from "../../model/tenants/__test__/helpers/createConfig";
import slugValidator from "../slugValidator";

import type { Tenant } from "../../types";

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
} as unknown as Tenant;

describe.concurrent("slugValidator", () => {
  it("should not throw error for valid slug", async () => {
    const validSlugs = [
      "a",
      "A",
      "a1",
      "abc",
      "Z1",
      "tenant1",
      "a-b",
      "a-1",
      "PrabhakarnaSriPalaWardhanaAtapattuJayaSuriyaLaxmanSivramKrishna",
    ];

    for (const slug of validSlugs) {
      tenant.slug = slug;

      expect(slugValidator(config, tenant)).toBe(undefined);
    }
  });

  it("should throw error for invalid slug", async () => {
    const invalidSlugs = [
      "",
      "1",
      "12",
      "1 2",
      "a ",
      "a b",
      "1tenant",
      "-ab",
      "a1-",
      "PrabhakarnaSriPalaWardhanaAtapattuJayaSuriyaLaxmanSivramKrishnaS",
    ];

    for (const slug of invalidSlugs) {
      tenant.slug = slug;

      try {
        slugValidator(config, tenant);

        expect(true).toBe(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(`'${slug}' is not valid slug`);
      }
    }
  });
  it("should support configured tenant", () => {
    const tenant = {
      identifier: 1,
      domain: "valid.example.test",
      name: "Valid Tenant",
      "sub-domain": "valid",
    } as unknown as Tenant;

    config.multiTenant.table = {
      columns: {
        id: "identifier",
        slug: "sub-domain",
      },
      name: "custom-tenant",
    };

    expect(slugValidator(config, tenant)).toBe(undefined);
  });
});
