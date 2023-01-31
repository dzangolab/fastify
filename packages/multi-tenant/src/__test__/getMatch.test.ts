import { describe, expect, it } from "vitest";

import getMatch from "../lib/getMatch";

describe("getMatch", () => {
  it("return hostname only", () => {
    expect(getMatch("https://example.com")).toStrictEqual({
      matchedDomain: "example.com",
      matchedSlug: "",
    });
  });

  it("reurn hostname and slug ", () => {
    expect(getMatch("https://test.example.com")).toStrictEqual({
      matchedDomain: "test.example.com",
      matchedSlug: "test",
    });
  });
});
