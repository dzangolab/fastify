import { describe, expect, it } from "vitest";

import { domainSchema } from "../validateTenantSchema";

describe.concurrent("domainSchema", () => {
  it.each([
    [undefined, true],
    ["example.com", true],
    ["www.ex-ample.com", true],
    ["ww-w.ex-ample.com", true],
    ["1-ww-w.ex-ample.com", true],
    ["example1.com", true],
    ["example-1.com", true],
    ["a-example.com", true],
    ["example.co", true],
    ["example.com.uk", true],
    ["example.edu", true],
    ["example.edu.au", true],
    ["example.comm", true],
    ["a.b.c.com", true],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com",
      true,
    ],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.example.com",
      true,
    ],
    ["", false],
    ["1", false],
    ["a", false],
    ["A", false],
    ["a1", false],
    ["example", false],
    [".com", false],
    ["1test", false],
    ["-ab", false],
    ["a1-", false],
    ["Example.com", false],
    ["example.COM", false],
    ["EXAMPLE.COM", false],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com",
      false,
    ],
    [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.example.com",
      false,
    ],
  ])("domainSchema.safeParse(slug) -> expected", async (slug, expected) => {
    expect(domainSchema.safeParse(slug).success).toBe(expected);
  });
});
