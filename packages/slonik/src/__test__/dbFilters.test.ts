import { sql } from "slonik";
import { describe, it, expect } from "vitest";

import { applyFiltersToQuery, applyFilter } from "../dbFilters";

import type { FilterInput, BaseFilterInput } from "../types";
import type { IdentifierSqlToken } from "slonik";

// Comprehensive dataset of filter combinations for testing
const getFilterDataset = (): Array<{
  name: string;
  filter: FilterInput;
  expectedSQL: RegExp;
  expectedValues: string[];
  description: string;
}> => {
  return [
    {
      name: "Simple equality filter",
      filter: { key: "name", operator: "eq", value: "test" },
      expectedSQL: /WHERE "users"\."name" = \$slonik_\d+$/,
      expectedValues: ["test"],
      description: "Basic equality operation",
    },
    {
      name: "Simple starts with filter",
      filter: { key: "name", operator: "sw", value: "test" },
      expectedSQL: /WHERE "users"\."name" ILIKE \$slonik_\d+$/,
      expectedValues: ["test%"],
      description: "Starts with operation",
    },
    {
      name: "Simple AND operation",
      filter: {
        AND: [
          { key: "name", operator: "sw", value: "test" },
          { key: "age", operator: "gt", value: "25" },
        ],
      },
      expectedSQL:
        /WHERE \("users"\."name" ILIKE \$slonik_\d+ AND "users"\."age" > \$slonik_\d+\)/,
      expectedValues: ["test%", "25"],
      description: "Simple AND with two conditions",
    },
    {
      name: "Simple OR operation",
      filter: {
        OR: [
          { key: "name", operator: "sw", value: "Test" },
          { key: "name", operator: "ew", value: "t1" },
        ],
      },
      expectedSQL:
        /WHERE \("users"\."name" ILIKE \$slonik_\d+ OR "users"\."name" ILIKE \$slonik_\d+\)/,
      expectedValues: ["Test%", "%t1"],
      description: "Simple OR with two conditions",
    },
    {
      name: "AND with nested OR",
      filter: {
        AND: [
          { key: "id", operator: "gt", value: "10" },
          {
            OR: [
              { key: "name", operator: "sw", value: "Test" },
              { key: "name", operator: "ew", value: "t1" },
            ],
          },
        ],
      },
      expectedSQL:
        /WHERE \("users"\."id" > \$slonik_\d+ AND \("users"\."name" ILIKE \$slonik_\d+ OR "users"\."name" ILIKE \$slonik_\d+\)\)/,
      expectedValues: ["10", "Test%", "%t1"],
      description: "AND containing OR - tests proper nesting",
    },
    {
      name: "OR with nested AND",
      filter: {
        OR: [
          { key: "id", operator: "gt", value: "10" },
          {
            AND: [
              { key: "name", operator: "sw", value: "Test" },
              { key: "name", operator: "ew", value: "t1" },
            ],
          },
        ],
      },
      expectedSQL:
        /WHERE \("users"\."id" > \$slonik_\d+ OR \("users"\."name" ILIKE \$slonik_\d+ AND "users"\."name" ILIKE \$slonik_\d+\)\)/,
      expectedValues: ["10", "Test%", "%t1"],
      description: "OR containing AND - tests proper nesting",
    },
    {
      name: "OR with multiple AND blocks",
      filter: {
        OR: [
          {
            AND: [
              { key: "name", operator: "sw", value: "Test" },
              { key: "age", operator: "gt", value: "25" },
            ],
          },
          {
            AND: [
              { key: "email", operator: "ew", value: "@test.com" },
              { key: "status", operator: "eq", value: "active" },
            ],
          },
        ],
      },
      expectedSQL:
        /WHERE \(\("users"\."name" ILIKE \$slonik_\d+ AND "users"\."age" > \$slonik_\d+\) OR \("users"\."email" ILIKE \$slonik_\d+ AND "users"\."status" = \$slonik_\d+\)\)/,
      expectedValues: ["Test%", "25", "%@test.com", "active"],
      description: "OR with multiple AND blocks - tests complex grouping",
    },
    {
      name: "Complex nested structure",
      filter: {
        OR: [
          {
            AND: [
              { key: "name", operator: "sw", value: "Test" },
              {
                OR: [
                  { key: "department", operator: "eq", value: "engineering" },
                  { key: "department", operator: "eq", value: "design" },
                ],
              },
            ],
          },
          {
            AND: [
              { key: "role", operator: "eq", value: "admin" },
              { key: "verified", operator: "eq", value: "true" },
            ],
          },
        ],
      },
      expectedSQL:
        /WHERE \(\("users"\."name" ILIKE \$slonik_\d+ AND \("users"\."department" = \$slonik_\d+ OR "users"\."department" = \$slonik_\d+\)\) OR \("users"\."role" = \$slonik_\d+ AND "users"\."verified" = \$slonik_\d+\)\)/,
      expectedValues: ["Test%", "engineering", "design", "admin", "true"],
      description: "Deep nesting: OR[AND[condition, OR[...]], AND[...]]",
    },
    {
      name: "Triple nested structure",
      filter: {
        AND: [
          { key: "status", operator: "eq", value: "active" },
          {
            OR: [
              {
                AND: [
                  { key: "age", operator: "gte", value: "18" },
                  { key: "age", operator: "lte", value: "65" },
                ],
              },
              {
                OR: [
                  { key: "role", operator: "eq", value: "admin" },
                  { key: "special", operator: "eq", value: "true" },
                ],
              },
            ],
          },
        ],
      },
      expectedSQL:
        /WHERE \("users"\."status" = \$slonik_\d+ AND \(\("users"\."age" >= \$slonik_\d+ AND "users"\."age" <= \$slonik_\d+\) OR \("users"\."role" = \$slonik_\d+ OR "users"\."special" = \$slonik_\d+\)\)\)/,
      expectedValues: ["active", "18", "65", "admin", "true"],
      description: "Triple nesting: AND[condition, OR[AND[...], OR[...]]]",
    },
    {
      name: "Single condition in AND array",
      filter: {
        AND: [{ key: "name", operator: "eq", value: "test" }],
      },
      expectedSQL: /WHERE "users"\."name" = \$slonik_\d+$/,
      expectedValues: ["test"],
      description: "Single condition should not have extra parentheses",
    },
    {
      name: "Single condition in OR array",
      filter: {
        OR: [{ key: "status", operator: "eq", value: "active" }],
      },
      expectedSQL: /WHERE "users"\."status" = \$slonik_\d+$/,
      expectedValues: ["active"],
      description: "Single condition should not have extra parentheses",
    },
    {
      name: "Multiple operators test",
      filter: {
        AND: [
          { key: "name", operator: "ct", value: "test" },
          { key: "age", operator: "bt", value: "25,65" },
          { key: "status", operator: "in", value: "active,pending" },
          { key: "deletedAt", operator: "eq", value: "null" },
        ],
      },
      expectedSQL:
        /WHERE \("users"\."name" ILIKE \$slonik_\d+ AND "users"\."age" BETWEEN \$slonik_\d+ AND \$slonik_\d+ AND "users"\."status" IN \(\$slonik_\d+, \$slonik_\d+\) AND "users"\."deleted_at" IS NULL\)/,
      expectedValues: ["%test%", "25", "65", "active", "pending"],
      description: "Tests all different operators",
    },
    {
      name: "NOT flag operations",
      filter: {
        AND: [
          { key: "name", operator: "eq", value: "test", not: true },
          {
            key: "status",
            operator: "in",
            value: "inactive,banned",
            not: true,
          },
        ],
      },
      expectedSQL:
        /WHERE \("users"\."name" != \$slonik_\d+ AND "users"\."status" NOT IN \(\$slonik_\d+, \$slonik_\d+\)\)/,
      expectedValues: ["test", "inactive", "banned"],
      description: "Tests NOT flag with different operators",
    },
  ];
};

describe("dbFilters", () => {
  const mockTableIdentifier: IdentifierSqlToken = sql.identifier(["users"]);
  const mockSchemaTableIdentifier: IdentifierSqlToken = sql.identifier([
    "public",
    "users",
  ]);

  describe("applyFilter", () => {
    it("should handle equality operator", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."name" = $slonik_');
      expect(result.values).toEqual(["John"]);
    });

    it("should handle equality operator with not flag", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
        not: true,
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."name" != $slonik_');
      expect(result.values).toEqual(["John"]);
    });

    it("should handle null values", () => {
      const filter: BaseFilterInput = {
        key: "deletedAt",
        operator: "eq",
        value: "null",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."deleted_at" IS NULL');
      expect(result.values).toEqual([]);
    });

    it("should handle null values with not flag", () => {
      const filter: BaseFilterInput = {
        key: "deletedAt",
        operator: "eq",
        value: "NULL",
        not: true,
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."deleted_at" IS NOT NULL');
      expect(result.values).toEqual([]);
    });

    it("should handle contains operator", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "ct",
        value: "John",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."name" ILIKE $slonik_');
      expect(result.values).toEqual(["%John%"]);
    });

    it("should handle starts with operator", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "sw",
        value: "John",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."name" ILIKE $slonik_');
      expect(result.values).toEqual(["John%"]);
    });

    it("should handle ends with operator", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "ew",
        value: "son",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."name" ILIKE $slonik_');
      expect(result.values).toEqual(["%son"]);
    });

    it("should handle greater than operator", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "gt",
        value: "25",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."age" > $slonik_');
      expect(result.values).toEqual(["25"]);
    });

    it("should handle greater than or equal operator", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "gte",
        value: "25",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."age" >= $slonik_');
      expect(result.values).toEqual(["25"]);
    });

    it("should handle less than operator", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "lt",
        value: "65",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."age" < $slonik_');
      expect(result.values).toEqual(["65"]);
    });

    it("should handle less than or equal operator", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "lte",
        value: "65",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."age" <= $slonik_');
      expect(result.values).toEqual(["65"]);
    });

    it("should handle in operator", () => {
      const filter: BaseFilterInput = {
        key: "status",
        operator: "in",
        value: "active,inactive,pending",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."status" IN ($slonik_');
      expect(result.values).toEqual(["active", "inactive", "pending"]);
    });

    it("should handle between operator", () => {
      const filter: BaseFilterInput = {
        key: "age",
        operator: "bt",
        value: "25,65",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."age" BETWEEN $slonik_');
      expect(result.values).toEqual(["25", "65"]);
    });

    it("should convert camelCase keys to snake_case", () => {
      const filter: BaseFilterInput = {
        key: "firstName",
        operator: "eq",
        value: "John",
      };

      const result = applyFilter(mockTableIdentifier, filter);

      expect(result.sql).toContain('"users"."first_name" = $slonik_');
      expect(result.values).toEqual(["John"]);
    });

    it("should handle schema.table identifiers", () => {
      const filter: BaseFilterInput = {
        key: "name",
        operator: "eq",
        value: "John",
      };

      const result = applyFilter(mockSchemaTableIdentifier, filter);

      expect(result.sql).toContain('"public"."users"."name" = $slonik_');
      expect(result.values).toEqual(["John"]);
    });
  });

  describe("applyFiltersToQuery", () => {
    it("should return empty fragment for empty AND array", () => {
      const filter: FilterInput = {
        AND: [],
      };

      const result = applyFiltersToQuery(filter, mockTableIdentifier);

      expect(result.sql).toBe("");
      expect(result.values).toEqual([]);
    });

    it("should return empty fragment for empty OR array", () => {
      const filter: FilterInput = {
        OR: [],
      };

      const result = applyFiltersToQuery(filter, mockTableIdentifier);

      expect(result.sql).toBe("");
      expect(result.values).toEqual([]);
    });

    // Dataset-based comprehensive tests
    describe("Comprehensive filter dataset tests", () => {
      const dataset = getFilterDataset();

      for (const testCase of dataset) {
        it(`should handle: ${testCase.name}`, () => {
          const result = applyFiltersToQuery(
            testCase.filter,
            mockTableIdentifier,
          );

          // Test SQL structure
          expect(result.sql).toMatch(testCase.expectedSQL);

          // Test parameter values
          expect(result.values).toEqual(testCase.expectedValues);
        });
      }
    });

    // Additional edge case tests
    it("should handle empty filter object gracefully", () => {
      const filter: FilterInput = {
        AND: [],
      };

      const result = applyFiltersToQuery(filter, mockTableIdentifier);
      expect(result.sql).toBe("");
      expect(result.values).toEqual([]);
    });

    it("should handle schema.table identifiers in complex queries", () => {
      const filter: FilterInput = {
        AND: [
          {
            key: "firstName",
            operator: "ct",
            value: "John",
          },
          {
            key: "lastName",
            operator: "sw",
            value: "Doe",
          },
        ],
      };

      const result = applyFiltersToQuery(filter, mockSchemaTableIdentifier);

      expect(result.sql).toContain(
        '"public"."users"."first_name" ILIKE $slonik_',
      );
      expect(result.sql).toContain(
        '"public"."users"."last_name" ILIKE $slonik_',
      );
      expect(result.values).toEqual(["%John%", "Doe%"]);
    });

    it("should handle mixed operators in complex nested structure", () => {
      const filter: FilterInput = {
        AND: [
          { key: "name", operator: "ct", value: "test" },
          {
            OR: [
              { key: "age", operator: "bt", value: "25,65" },
              { key: "status", operator: "in", value: "active,pending" },
            ],
          },
          { key: "deletedAt", operator: "eq", value: "null" },
        ],
      };

      const result = applyFiltersToQuery(filter, mockTableIdentifier);

      expect(result.sql).toContain('"users"."name" ILIKE $slonik_');
      expect(result.sql).toContain('"users"."age" BETWEEN $slonik_');
      expect(result.sql).toContain('"users"."status" IN ($slonik_');
      expect(result.sql).toContain('"users"."deleted_at" IS NULL');
      expect(result.values).toEqual([
        "%test%",
        "25",
        "65",
        "active",
        "pending",
      ]);
    });

    it("should validate parentheses placement for complex queries", () => {
      const filter: FilterInput = {
        OR: [
          {
            AND: [
              { key: "category", operator: "eq", value: "electronics" },
              { key: "price", operator: "lt", value: "100" },
            ],
          },
          {
            AND: [
              { key: "category", operator: "eq", value: "books" },
              { key: "inStock", operator: "eq", value: "true" },
            ],
          },
        ],
      };

      const result = applyFiltersToQuery(filter, mockTableIdentifier);

      // Verify proper grouping with parentheses
      expect(result.sql).toMatch(
        /WHERE \(\("users"\."category" = \$slonik_\d+ AND "users"\."price" < \$slonik_\d+\) OR \("users"\."category" = \$slonik_\d+ AND "users"\."in_stock" = \$slonik_\d+\)\)/,
      );
      expect(result.values).toEqual(["electronics", "100", "books", "true"]);
    });
  });
});
