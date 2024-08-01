/* istanbul ignore file */
import "@dzangolab/fastify-graphql";

import { describe, expect, it, vi } from "vitest";

import createConfig from "./helpers/createConfig";
import { createDatabase } from "./helpers/createDatabase";
import { getFakeId, getLimitAndOffsetDataset } from "./helpers/utils";
import resolver from "../model/users/resolver";

import type { MercuriusContext } from "mercurius";
import type { Mock } from "vitest";

const findById = vi.fn();
const list = vi.fn();

vi.mock("../model/users/service", () => ({
  default: class UserService {
    findById = findById;
    list = list;
  },
}));

describe("user service resolver", () => {
  /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const queryValue: Mock<any[], any> = vi.fn();

  const context = {
    config: createConfig(),
    database: createDatabase(queryValue),
  } as MercuriusContext;

  it("Should call the UserService findById method with proper id", () => {
    const id = getFakeId();

    resolver.Query.user(undefined, { id }, context);

    expect(findById).toBeCalledWith(id);
  });

  it("Should call the UserService list method with proper limit and offset values", async () => {
    const count = 190;

    const dataset = await getLimitAndOffsetDataset(count, createConfig());

    for await (const set of dataset) {
      const { limit, offset } = set();

      if (limit && offset) {
        resolver.Query.users(undefined, { limit, offset }, context);

        expect(list).toBeCalledWith(
          limit,
          offset,
          /* eslint-disable-next-line unicorn/no-useless-undefined */
          undefined,
          /* eslint-disable-next-line unicorn/no-useless-undefined */
          undefined
        );
      }
    }
  });
});
