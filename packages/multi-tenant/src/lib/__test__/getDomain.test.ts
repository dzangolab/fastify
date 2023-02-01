import { describe, expect, it } from "vitest";

import getDomain from "../getDomain";

describe("getDomain", () => {
  it("should return same", () => {
    expect(getDomain("example.test")).toEqual("example.test");
  });

  it("should remove https", () => {
    expect(getDomain("https://example.test")).toEqual("example.test");
  });

  it("should remove path", () => {
    expect(getDomain("https://example.test/users/1")).toEqual("example.test");
  });

  it("should include subdomain", () => {
    expect(getDomain("https://api.example.test")).toEqual("api.example.test");
  });

  it("should include subdomain and remove path", () => {
    expect(getDomain("https://api.example.test/user/1")).toEqual(
      "api.example.test"
    );
  });

  it("should return empty", () => {
    expect(getDomain("")).toEqual("");
  });

  it("should return same", () => {
    expect(getDomain("example")).toEqual("example");
  });

  it("should include port", () => {
    expect(getDomain("http://example.test:8080")).toEqual("example.test:8080");
  });

  it("should include port and ignore path", () => {
    expect(getDomain("http://example.test:8080/path")).toEqual(
      "example.test:8080"
    );
  });
});
