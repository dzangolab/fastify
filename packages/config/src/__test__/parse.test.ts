/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import parse from "../parse";

describe("parse", () => {
  it("parses a boolean", () => {
    expect(parse("false", false)).toBe(false);
  });

  it("parses a number", () => {
    expect(parse("23", 1)).toBe(23);
  });

  it("parses a number as a string", () => {
    expect(parse("23", "abc")).toBe("23");
  });

  it("parses 'false' as a string", () => {
    expect(parse("false", "abc")).toBe("false");
  });

  it("returns the fallback value as a boolean", () => {
    expect(parse(undefined, true)).toBe(true);
  });

  it("returns the fallback value as a number", () => {
    expect(parse(undefined, 123)).toBe(123);
  });

  it("returns the fallback value as a string", () => {
    expect(parse(undefined, "abc")).toBe("abc");
  });

  it("returns undefined", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(parse(undefined, undefined)).toBe(undefined);
  });

  it("throws SyntaxError Exception due to json parse on boolean", () => {
    try {
      parse("Dzango", false);
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it("returns SyntaxError Exception due to json parse on number", () => {
    try {
      parse("Dzango", 14);
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });
});
