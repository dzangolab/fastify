import type { FilterInput, SortInput } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const getFilterDataset = () => {
  return [
    { key: "name", operator: "ct", value: "Test" },
    { key: "name", operator: "ew", value: "t1" },
    { key: "name", operator: "sw", value: "Test" },
    { key: "name", operator: "eq", value: "Test" },
    { key: "id", operator: "gt", value: 10 },
    { key: "id", operator: "gte", value: 10 },
    { key: "id", operator: "lt", value: 10 },
    { key: "id", operator: "lte", value: 10 },
    { key: "name", operator: "in", value: "Test1, Test2" },
    { key: "id", operator: "bt", value: "10, 20" },
    { key: "id", not: true, operator: "bt", value: "10, 20" },
    { AND: [{ key: "id", operator: "lt", value: 10 }] },
    { OR: [{ key: "id", operator: "lt", value: 10 }] },
    {
      AND: [
        { key: "name", operator: "sw", value: "Test" },
        { key: "name", operator: "ew", value: "t1" },
      ],
    },
    {
      OR: [
        { key: "name", operator: "sw", value: "Test" },
        { key: "name", operator: "ew", value: "t1" },
      ],
    },
    {
      AND: [
        { key: "id", operator: "gt", value: 10 },
        {
          OR: [
            { key: "name", operator: "sw", value: "Test" },
            { key: "name", operator: "ew", value: "t1" },
          ],
        },
      ],
    },
    {
      OR: [
        { key: "id", operator: "gt", value: 10 },
        {
          AND: [
            { key: "name", operator: "sw", value: "Test" },
            { key: "name", operator: "ew", value: "t1" },
          ],
        },
      ],
    },
    {
      AND: [
        { key: "id", operator: "gt", value: 10 },
        { key: "name", operator: "sw", value: "Test" },
        { key: "name", operator: "ew", value: "t1" },
      ],
    },
    {
      OR: [
        { key: "id", operator: "gt", value: 10 },
        { key: "name", operator: "sw", value: "Test" },
        { key: "name", operator: "ew", value: "t1" },
      ],
    },
    {
      AND: [
        { key: "name", operator: "sw", not: true, value: "Test" },
        { key: "name", operator: "ew", not: true, value: "t1" },
      ],
    },
    {
      OR: [
        { key: "name", operator: "sw", not: true, value: "Test" },
        { key: "name", operator: "ew", not: true, value: "t1" },
      ],
    },
  ] as FilterInput[];
};

const getLimitAndOffsetDataset = async (count: number, config: ApiConfig) => {
  return [
    () => {
      const limit = Math.floor((Math.random() * count) / 2);
      const offset = Math.floor((Math.random() * count) / 2);
      const useCase = "General case";

      return {
        limit,
        offset,
        useCase,
      };
    },
    () => {
      const offset = Math.floor((Math.random() * count) / 2);
      const useCase = "Limit too large";

      return {
        limit: count * 2,
        offset: offset,
        useCase,
      };
    },
    () => {
      const useCase = "Invalid offset";

      return {
        limit: Math.floor((Math.random() * count) / 2),
        offset: count,
        useCase,
      };
    },
    () => {
      const useCase = "0 values";

      return {
        limit: 0,
        offset: 0,
        result: [],
        useCase,
      };
    },
    () => {
      const useCase = "Undefined values";

      return {
        limit: undefined,
        offset: undefined,
        useCase,
      };
    },
    () => {
      const useCase = "Limit greater than max_limit";

      return {
        limit: (config?.slonik?.pagination?.maxLimit ?? 999_999) + 1,
        offset: 0,
        useCase,
      };
    },
  ];
};

const getSortDataset = () => {
  return [
    [{ key: "name", direction: "ASC" }],
    [{ key: "id", direction: "DESC" }],
    [
      { key: "id", direction: "DESC" },
      { key: "name", direction: "ASC" },
    ],
  ] as SortInput[][];
};

export { getFilterDataset, getLimitAndOffsetDataset, getSortDataset };
