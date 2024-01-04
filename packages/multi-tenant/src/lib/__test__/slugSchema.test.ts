import { describe, expect, it } from "vitest";

import { slugSchema } from "../validateTenantSchema";

describe.concurrent("slugSchema", () => {
  it.each([
    ["a", true],
    ["a1", true],
    ["abc", true],
    ["tenant1", true],
    ["a-b", true],
    ["a-1", true],
    ["", false],
    ["a-1", true],
    ["", false],
    ["1", false],
    ["12", false],
    ["1 2", false],
    ["a ", false],
    ["a b", false],
    ["A", false],
    ["Z1", false],
    ["1tenant", false],
    ["-ab", false],
    ["a1-", false],
    [undefined, false],
  ])("slugSchema.safeParse(slug) -> expected", async (slug, expected) => {
    expect(slugSchema.safeParse(slug).success).toBe(expected);
  });
});
