import { sql } from "slonik";
import { describe, expect, it } from "vitest";

import { applyFilter } from "../dbFilters";

import type { BaseFilterInput } from "../types";

describe("applyFilter", () => {
  const tableIdentifier = sql.identifier(["public", "users"]);

  describe("null values", () => {
    it("should handle IS NULL", () => {
      const filter: BaseFilterInput = {
        key: "email",
        operator: "eq",
        value: "null",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."email" IS NULL');
    });

    it("should handle IS NOT NULL", () => {
      const filter: BaseFilterInput = {
        key: "email",
        operator: "eq",
        value: "null",
        not: true,
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."email" IS NOT NULL');
    });
  });

  describe("comparison operators", () => {
    it("should handle equals (eq)", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."name" = $slonik_1');
      expect(result.values).toEqual(["John"]);
    });

    it("should handle not equals", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
        not: true,
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."name" != $slonik_1');
      expect(result.values).toEqual(["John"]);
    });

    it("should handle greater than (gt)", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "gt",
        value: "18",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."age" > $slonik_1');
      expect(result.values).toEqual(["18"]);
    });

    it("should handle less than or equal (lte)", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "lte",
        value: "65",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."age" <= $slonik_1');
      expect(result.values).toEqual(["65"]);
    });
  });

  describe("pattern matching operators", () => {
    it("should handle contains (ct)", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "ct",
        value: "oh",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."name" ILIKE $slonik_1');
      expect(result.values).toEqual(["%oh%"]);
    });

    it("should handle starts with (sw)", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "sw",
        value: "Jo",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."name" ILIKE $slonik_1');
      expect(result.values).toEqual(["Jo%"]);
    });
  });

  describe("list operators", () => {
    it("should handle IN operator", () => {
      const filter: BaseFilterInput = {
        key: "status",
        operator: "in",
        value: "active,pending,blocked",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        '"public"."users"."status" IN ($slonik_1, $slonik_2, $slonik_3)',
      );
      expect(result.values).toEqual(["active", "pending", "blocked"]);
    });

    it("should handle BETWEEN operator", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "bt",
        value: "18,65",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        '"public"."users"."age" BETWEEN $slonik_1 AND $slonik_2',
      );
      expect(result.values).toEqual(["18", "65"]);
    });
  });

  describe("case insensitive searches", () => {
    it("should handle case insensitive equals", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
        insensitive: true,
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        'unaccent(lower("public"."users"."name")) = unaccent(lower($slonik_1))',
      );
      expect(result.values).toEqual(["John"]);
    });

    it("should handle case insensitive contains", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "ct",
        value: "oh",
        insensitive: true,
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        'unaccent(lower("public"."users"."name")) ILIKE unaccent(lower($slonik_1))',
      );
      expect(result.values).toEqual(["%oh%"]);
    });

    it("should handle case insensitive IN", () => {
      const filter: BaseFilterInput = {
        key: "status",
        operator: "in",
        value: "Active,Pending",
        insensitive: true,
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        'unaccent(lower("public"."users"."status")) IN (unaccent(lower($slonik_1)), unaccent(lower($slonik_2)))',
      );
      expect(result.values).toEqual(["Active", "Pending"]);
    });

    it("should handle case insensitive BETWEEN", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "bt",
        value: "A,Z",
        insensitive: true,
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        'unaccent(lower("public"."users"."name")) BETWEEN unaccent(lower($slonik_1)) AND unaccent(lower($slonik_2))',
      );
      expect(result.values).toEqual(["A", "Z"]);
    });

    it("should handle insensitive with string 'true'", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
        insensitive: "true",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        'unaccent(lower("public"."users"."name")) = unaccent(lower($slonik_1))',
      );
      expect(result.values).toEqual(["John"]);
    });

    it("should handle insensitive with string '1'", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
        insensitive: "1",
      };

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe(
        'unaccent(lower("public"."users"."name")) = unaccent(lower($slonik_1))',
      );
      expect(result.values).toEqual(["John"]);
    });
  });

  describe("edge cases", () => {
    it("should default to eq operator if not provided", () => {
      const filter = {
        key: "name",
        value: "John",
        operator: "eq",
      } as BaseFilterInput;

      const result = applyFilter(tableIdentifier, filter);
      expect(result.sql).toBe('"public"."users"."name" = $slonik_1');
      expect(result.values).toEqual(["John"]);
    });

    it("should throw error for empty IN list", () => {
      const filter: BaseFilterInput = {
        key: "status",
        operator: "in",
        value: "",
      };

      expect(() => applyFilter(tableIdentifier, filter)).toThrow(
        "IN operator requires at least one value",
      );
    });

    it("should throw error for empty IN list with NOT", () => {
      const filter: BaseFilterInput = {
        key: "status",
        operator: "in",
        value: "",
        not: true,
      };

      expect(() => applyFilter(tableIdentifier, filter)).toThrow(
        "IN operator requires at least one value",
      );
    });

    it("should throw error for invalid BETWEEN values", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "bt",
        value: "18", // Missing second value
      };

      expect(() => applyFilter(tableIdentifier, filter)).toThrow(
        "BETWEEN operator requires exactly two values",
      );
    });

    it("should throw error for empty BETWEEN values", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "bt",
        value: "",
      };

      expect(() => applyFilter(tableIdentifier, filter)).toThrow(
        "BETWEEN operator requires exactly two values",
      );
    });
  });
});
