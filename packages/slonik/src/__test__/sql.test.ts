import { describe, it, expect } from "vitest";

import { isValueExpression } from "../sql";

describe("isValueExpression", () => {
  it("should return true for valid ValueExpression types", () => {
    // eslint-disable-next-line unicorn/no-null
    expect(isValueExpression(null)).toBe(true);
    expect(isValueExpression("string")).toBe(true);
    expect(isValueExpression(123)).toBe(true);
    expect(isValueExpression(true)).toBe(true);
    expect(isValueExpression(false)).toBe(true);
    expect(isValueExpression(new Date())).toBe(true);
    expect(isValueExpression(Buffer.from("test"))).toBe(true);
    expect(isValueExpression([1, 2, 3])).toBe(true);
  });

  it("should return false for invalid ValueExpression types", () => {
    expect(isValueExpression(() => {})).toBe(false);
    expect(isValueExpression({})).toBe(false);
    expect(isValueExpression(Symbol("test"))).toBe(false);
    expect(isValueExpression(new Map())).toBe(false);
    expect(isValueExpression(new Set())).toBe(false);
  });

  it("should return true for nested valid ValueExpression structures", () => {
    // eslint-disable-next-line unicorn/no-null
    expect(isValueExpression([null, "string", 123, true, new Date()])).toBe(
      true,
    );
  });

  it("should return false for invalid nested structures", () => {
    // eslint-disable-next-line unicorn/no-null
    expect(isValueExpression([null, "string", () => {}])).toBe(false);
    expect(
      isValueExpression([{ type: Symbol("valid") }, { invalidKey: "invalid" }]),
    ).toBe(false);
  });
});
