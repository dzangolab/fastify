/* istanbul ignore file */
import { describe, expect, it, vi } from "vitest";

import createConfig from "./helpers/createConfig";
import { createDatabase, removeExtraSpace } from "./helpers/createDatabase";
import { getFakeData } from "./helpers/utils";
import UserService from "../model/user-profile/service";

import type { Mock } from "vitest";

describe("UserProfile Service", () => {
  /*eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const queryValue: Mock<any[], any> = vi.fn();

  const config = createConfig();
  const service = new UserService(config, createDatabase(queryValue));

  it("should create a new user instance", async () => {
    // test "create" method
    const data = getFakeData();
    await service.create(data);

    const query = service.factory.getCreateSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("should find correct entity instance", async () => {
    // test "findById" method
    await service.findById(10);

    const query = service.factory.getFindByIdSql(10);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("should update entity instance", async () => {
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

  it("should delete the entity instance", async () => {
    // test "delete" method
    const id = 10;

    await service.delete(id);

    const query = service.factory.getDeleteSql(id);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });
});
