import { describe, expect, it } from "vitest";

import getHost from "../getHost";

describe.concurrent("getHost", () => {
  it.each([
    ["localhost", "localhost"],
    ["localhost:3000", "localhost:3000"],
    ["127.0.0.1", "127.0.0.1"],
    ["127.0.0.1:3000", "127.0.0.1:3000"],
    ["example.test", "example.test"],
    ["https://example.test", "example.test"],
    ["https://example.test/users/1", "example.test"],
    ["https://api.example.test", "api.example.test"],
    ["https://api.example.test/user/1", "api.example.test"],
    ["", ""],
    ["example", "example"],
    ["http://example.test:8080", "example.test:8080"],
    ["http://example.test:8080/path", "example.test:8080"],
  ])("getHost(url) -> domain", async (url, expected) => {
    expect(getHost(url)).toBe(expected);
  });
});
