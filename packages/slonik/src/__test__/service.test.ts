/* istanbul ignore file */
import { afterEach, describe, expect, it, vi } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase, { removeExtraSpace } from "./helpers/createDatabase";
import TestService from "./helpers/testService";
import {
  getFilterDataset,
  getLimitAndOffsetDataset,
  getSortDataset,
} from "./helpers/utils";
import BaseService from "../service";

import type { SlonikConfig } from "../types";

describe("Service", () => {
  const queryValue = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns table name", () => {
    const config = createConfig();

    const database = createDatabase(queryValue);

    const service = new TestService(config, database);

    expect(service.table).toBe(TestService.TABLE);
  });

  it("returns class default limit", () => {
    const config = createConfig();

    const database = createDatabase(queryValue);

    const service = new TestService(config, database);

    expect(service.getLimitDefault()).toBe(BaseService.LIMIT_DEFAULT);
  });

  it("returns class max limit", () => {
    const config = createConfig();

    const database = createDatabase(queryValue);

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

    const database = createDatabase(queryValue);

    const service = new TestService(createConfig(config), database, "test");

    expect(service.getLimitDefault()).toBe(config.pagination?.defaultLimit);
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

    const database = createDatabase(queryValue);

    const service = new TestService(createConfig(config), database);

    expect(service.getLimitMax()).toBe(config.pagination?.maxLimit);
  });

  it("calls database with correct sql query for all method", async () => {
    const config = createConfig();

    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const data = ["id", "name"];

    const response = await service.all(data);

    const query = service.factory.getAllSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );

    expect(response).toBe(result);
  });

  it("calls database with correct sql query for create method", async () => {
    const config = createConfig();

    const result = [{ id: 1, name: "Test", value: 10 }];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const data = { name: "Test", value: 10 };

    const response = await service.create(data);

    const query = service.factory.getCreateSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );

    expect(response).toBe(result[0]);
  });

  it("calls database with correct sql query for delete method", async () => {
    const config = createConfig();

    const data = 10;

    const result = [{ id: data, name: "Test", value: 10 }];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const response = await service.delete(data);

    const query = service.factory.getDeleteSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );

    expect(response).toBe(result[0]);
  });

  it("calls database with correct sql query for findById method", async () => {
    const config = createConfig();

    const data = 10;

    const result = [{ id: data, name: "Test", value: 10 }];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const response = await service.findById(data);

    const query = service.factory.getFindByIdSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );

    expect(response).toBe(result[0]);
  });

  it("calls database with correct sql query for update method", async () => {
    const config = createConfig();

    const data = { name: "Test", value: 10 };

    const result = [{ id: 10, ...data }];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const response = await service.update(10, data);

    const query = service.factory.getUpdateSql(10, data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );

    expect(response).toBe(result[0]);
  });

  it("calls database with correct sql query for create method for other schema", async () => {
    const config = createConfig();

    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database, "tenant1");

    const data = ["id", "name"];

    const response = await service.all(data);

    const query = service.factory.getAllSql(data);

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );

    expect(response).toBe(result);
  });

  it("calls database with correct sql query for list method", async () => {
    const config = createConfig();

    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const response = await service.list();

    const query = service.factory.getListSql(service.getLimitDefault());

    expect(queryValue).toHaveBeenCalledWith(
      removeExtraSpace(query.sql),
      query.values
    );

    expect(response).toEqual({ totalCount: result.length, data: result });
  });

  it("calls database with correct sql query for list method with limit and offset arguments", async () => {
    const config = createConfig();

    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const database = createDatabase(queryValue, result);

    const count = 190;

    const dataset = await getLimitAndOffsetDataset(count, config);

    const service = new TestService(config, database);

    for await (const set of dataset) {
      const { limit, offset } = set();

      const response = await service.list(limit, offset);

      const query = service.factory.getListSql(
        Math.min(limit ?? service.getLimitDefault(), service.getLimitMax()),
        offset
      );

      expect(queryValue).toHaveBeenCalledWith(
        removeExtraSpace(query.sql),
        query.values
      );

      expect(response).toEqual({ totalCount: result.length, data: result });
    }
  });

  it("calls database with correct sql query for list method with filter", async () => {
    const config = createConfig();

    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const limit = 190;

    const filterInputs = getFilterDataset();

    for (const filterInput of filterInputs) {
      const response = await service.list(limit, undefined, filterInput);

      const query = service.factory.getListSql(
        Math.min(limit ?? service.getLimitDefault(), service.getLimitMax()),
        undefined,
        filterInput
      );

      expect(queryValue).toHaveBeenCalledWith(
        removeExtraSpace(query.sql),
        query.values
      );

      expect(response).toEqual({ totalCount: result.length, data: result });
    }
  });

  it("calls database with correct sql query for list method with sort", async () => {
    const config = createConfig();

    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const database = createDatabase(queryValue, result);

    const service = new TestService(config, database);

    const limit = 190;

    const sortInputs = getSortDataset();

    for (const sortInput of sortInputs) {
      const response = await service.list(
        limit,
        undefined,
        undefined,
        sortInput
      );

      const query = service.factory.getListSql(
        Math.min(limit ?? service.getLimitDefault(), service.getLimitMax()),
        undefined,
        undefined,
        sortInput
      );

      expect(queryValue).toHaveBeenCalledWith(
        removeExtraSpace(query.sql),
        query.values
      );

      expect(response).toEqual({ totalCount: result.length, data: result });
    }
  });
});
