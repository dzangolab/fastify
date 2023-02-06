import { describe, expect, it } from "vitest";

import getHost from "../getHost";

describe("getHost", () => {
  // it("should return same", () => {
  //   expect(getHost("example.test")).toEqual("example.test");
  // });

  it("should remove https", () => {
    expect(getHost("https://example.test")).toEqual("example.test");
  });

  it("should remove path", () => {
    expect(getHost("https://example.test/users/1")).toEqual("example.test");
  });

  it("should include subdomain", () => {
    expect(getHost("https://api.example.test")).toEqual("api.example.test");
  });

  it("should include subdomain and remove path", () => {
    expect(getHost("https://api.example.test/user/1")).toEqual(
      "api.example.test"
    );
  });

  it("should return empty", () => {
    expect(getHost("")).toEqual("");
  });

  it("should return when invalid url passed", () => {
    expect(getHost("example")).toEqual("");
  });

  it("should include port", () => {
    expect(getHost("http://example.test:8080")).toEqual("example.test:8080");
  });

  it("should include port and ignore path", () => {
    expect(getHost("http://example.test:8080/path")).toEqual(
      "example.test:8080"
    );
  });
});
