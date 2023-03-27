import "@dzangolab/fastify-slonik";

import { ApiConfig } from "@dzangolab/fastify-config";

import type {
  UserProfileCreateInput,
  UserProfileUpdateInput,
} from "../../types";

export const getFakeData = ():
  | UserProfileCreateInput
  | UserProfileUpdateInput => ({
  email: "monorepo@dzangolab.com",
});

export const getPartialFakeData = ():
  | UserProfileCreateInput
  | UserProfileUpdateInput => ({
  id: getFakeId(),
});

export const getLimitAndOffsetDataset = async (
  count: number,
  config: ApiConfig
) => {
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

export const getFakeId = () => "90J02HIUFH8334H933";
