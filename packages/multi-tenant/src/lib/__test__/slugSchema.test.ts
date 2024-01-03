import { describe, expect, it } from "vitest";

import { slugSchema } from "../validateTenantSchema";

describe.concurrent("slugSchema", () => {
  it("should return true for valid slug", async () => {
    const validSlugs = ["a", "A", "a1", "abc", "Z1", "tenant1", "a-b", "a-1"];

    for (const slug of validSlugs) {
      expect(slugSchema.safeParse(slug).success).toBe(true);
    }
  });

  it("should return false for invalid slug", async () => {
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
      expect(slugSchema.safeParse(slug).success).toBe(false);
    }
  });
});
