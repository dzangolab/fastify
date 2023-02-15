/* istanbul ignore file */
import { afterEach, describe, expect, it, vi } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase, { removeExtraSpace } from "./helpers/createDatabase";
import TestService from "./helpers/testService";
import BaseService from "../service";

import type { SlonikConfig } from "../types";

describe("Service", () => {
  const queryValue = vi.fn();

  const database = createDatabase(queryValue);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns table name", () => {
    const config = createConfig();

    const service = new TestService(config, database);

    expect(service.table).toBe(TestService.TABLE);
  });

  it("returns class default limit", () => {
    const config = createConfig();

    const service = new TestService(config, database);

    expect(service.getLimitDefault()).toBe(BaseService.LIMIT_DEFAULT);
  });

  it("returns class max limit", () => {
    const config = createConfig();

    const service = new TestService(config, database, "test");

    expect(service.getLimitMax()).toBe(BaseService.LIMIT_MAX);
  });

  it("returns default limit as per config", () => {
    const config = {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
      pagination: {
        defaultLimit: 5,
        maxLimit: 10,
      },
    } as SlonikConfig;

    const service = new TestService(createConfig(config), database, "test");

    expect(service.getLimitDefault()).toBe(config.pagination.defaultLimit);
  });

  it("returns max limit as per config", () => {
    const config = {
      db: {
        databaseName: "test",
        host: "localhost",
        password: "password",
        username: "username",
      },
      pagination: {
        defaultLimit: 5,
        maxLimit: 10,
      },
    } as SlonikConfig;

    const service = new TestService(createConfig(config), database);

    expect(service.getLimitMax()).toBe(config.pagination.maxLimit);
  });

  it("calls database with correct sql query for all method", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = ["id", "name"];

    await service.all(data);

    const query = service.factory.getAllSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("calls database with correct sql query for create method", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = { name: "Test", value: 10 };

    await service.create(data);

    const query = service.factory.getCreateSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("calls database with correct sql query for delete method", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = 10;

    await service.delete(data);

    const query = service.factory.getDeleteSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("calls database with correct sql query for findById method", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = 10;

    await service.findById(data);

    const query = service.factory.getFindByIdSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("calls database with correct sql query for update method", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = { name: "Test", value: 10 };

    await service.update(10, data);

    const query = service.factory.getUpdateSql(10, data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("calls database with correct sql query for create method for other scheam", async () => {
    const config = createConfig();

    const service = new TestService(config, database, "tenant1");

    const data = ["id", "name"];

    await service.all(data);

    const query = service.factory.getAllSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });

  it("calls database with correct sql query for list method", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    await service.list();

    const query = service.factory.getListSql(service.getLimitDefault());

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );
  });
});
