/* istanbul ignore file */
import { describe, expect, it, vi } from "vitest";

import createConfig from "./helpers/createConfig";
import { createDatabase, removeExtraSpace } from "./helpers/createDatabase";
import { getFakeData, getLimitAndOffsetDataset } from "./helpers/utils";
import UserService from "../model/user-profile/service";

import type { Mock } from "vitest";

describe("UserProfile Service", () => {
  /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const queryValue: Mock<any[], any> = vi.fn();

  const config = createConfig();
  const service = new UserService(config, createDatabase(queryValue));

  it("should create a new user profile instance", async () => {
    // test "create" method
    const data = getFakeData();
    await service.create(data);

    const query = service.factory.getCreateSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("should find correct correct user profile", async () => {
    // test "findById" method
    await service.findById(10);

    const query = service.factory.getFindByIdSql(10);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("should update correct user profile", async () => {
    // test "update" method
    const id = 10;

    const data = getFakeData();
    await service.update(id, data);

    const query = service.factory.getUpdateSql(id, data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("should delete the correct user profile", async () => {
    // test "delete" method
    const id = 10;

    await service.delete(id);

    const query = service.factory.getDeleteSql(id);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("should return all users profile", async () => {
    // test "all" method
    await service.all(["id", "name"]);

    const query = service.factory.getAllSql(["id", "name"]);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("should return an array of user profile", async () => {
    // test "list" method
    const count = 190;

    const dataset = await getLimitAndOffsetDataset(count, config);

    for await (const set of dataset) {
      const { limit, offset } = set();

      await service.list(limit, offset);

      const query = await service.factory.getListSql(
        Math.min(limit ?? service.getLimitDefault(), service.getLimitMax()),
        offset
      );

      expect(queryValue).toHaveBeenCalledWith(
        removeExtraSpace(query.sql),
        query.values
      );
    }
  });
});
