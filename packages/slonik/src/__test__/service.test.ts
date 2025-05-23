/* istanbul ignore file */
import { newDb } from "pg-mem";
import { describe, expect, it } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";
import TestSqlFactory from "./helpers/sqlFactory";
import TestService from "./helpers/testService";
import {
  getFilterDataset,
  getLimitAndOffsetDataset,
  getSortDataset,
} from "./helpers/utils";

import type { SlonikOptions } from "../types";

describe("Service", async () => {
  const db = newDb();

  db.public.none(`
    create table test(id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, name TEXT, latitude INT, country_code TEXT);
    insert into test (name, latitude, country_code) values ('Test1', 20, 'NP'), ('Test2', 30, 'US');
    create schema tenant1;
    create table tenant1.test(id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, name TEXT, latitude INT, country_code TEXT);
    insert into tenant1.test (name, latitude, country_code) values ('Test1', 20, 'NP'), ('Test2', 30, 'US');
  `);

  const config = createConfig();
  const database = await createDatabase({ db });

  it("returns table name", async () => {
    const service = new TestService(config, database);

    expect(service.table).toBe(TestSqlFactory.TABLE);
  });

  it("returns class default limit", async () => {
    const service = new TestService(config, database);

    expect(service.factory.limitDefault).toBe(TestSqlFactory.LIMIT_DEFAULT);
  });

  it("returns class max limit", async () => {
    const service = new TestService(config, database, "test");

    expect(service.factory.limitMax).toBe(TestSqlFactory.LIMIT_MAX);
  });

  it("returns default limit as per config", async () => {
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
    } as SlonikOptions;

    const service = new TestService(createConfig(config), database, "test");

    expect(service.factory.limitDefault).toBe(config.pagination?.defaultLimit);
  });

  it("returns max limit as per config", async () => {
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
    } as SlonikOptions;

    const service = new TestService(createConfig(config), database);

    expect(service.factory.limitMax).toBe(config.pagination?.maxLimit);
  });

  it("returns count", async () => {
    const result = [{ count: 2 }];

    const service = new TestService(config, database);

    const response = await service.count();

    expect(response).toBe(result[0].count);
  });

  it("calls database with correct sql query for all method", async () => {
    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const service = new TestService(config, database);

    const data = ["id", "name"];

    const response = await service.all(data);

    expect(response).toStrictEqual(result);
  });

  it("calls database with correct sql query for find method", async () => {
    const result = [
      { id: 1, name: "Test1", countryCode: "NP", latitude: 20 },
      { id: 2, name: "Test2", countryCode: "US", latitude: 30 },
    ];

    const service = new TestService(config, database);

    const response = await service.find();

    expect(response).toStrictEqual(result);
  });

  it("calls database with correct sql query for findOne method", async () => {
    const result = { id: 1, name: "Test1", countryCode: "NP", latitude: 20 };

    const service = new TestService(config, database);

    const response = await service.findOne(
      { key: "id", operator: "eq", value: "1" },
      [{ key: "id", direction: "ASC" }],
    );

    expect(response).toStrictEqual(result);
  });

  it("calls database with correct sql query for create method", async () => {
    const result = [{ id: 3, name: "Test", latitude: 20, countryCode: "FR" }];

    const service = new TestService(config, database);

    const data = { name: "Test", latitude: 20, countryCode: "FR" };

    const response = await service.create(data);

    expect(response).toStrictEqual(result[0]);
  });

  it("calls database with correct sql query for findById method", async () => {
    const data = 1;

    const result = [{ id: 1, name: "Test1", latitude: 20, countryCode: "NP" }];

    const service = new TestService(config, database);

    const response = await service.findById(data);

    expect(response).toStrictEqual(result[0]);
  });

  it("calls database with correct sql query for update method", async () => {
    const data = { name: "updated test" };

    const result = [{ id: 1, ...data, latitude: 20, countryCode: "NP" }];

    const service = new TestService(config, database);

    const response = await service.update(1, data);

    expect(response).toStrictEqual(result[0]);
  });

  it("calls database with correct sql query for delete method", async () => {
    const id = 3;

    const result = [{ id: 3, name: "Test", latitude: 20, countryCode: "FR" }];

    const service = new TestService(config, database);

    const response = await service.delete(id);

    expect(response).toStrictEqual(result[0]);
  });

  it("calls database with correct sql query for create method for other schema", async () => {
    const result = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];

    const service = new TestService(config, database, "tenant1");

    const data = ["id", "name"];

    const response = await service.all(data);

    expect(response).toStrictEqual(result);
  });

  it("calls database with correct sql queries for list method", async () => {
    const service = new TestService(config, database);

    const response = await service.list();

    expect(response).toHaveProperty("totalCount");
    expect(response).toHaveProperty("filteredCount");
    expect(response).toHaveProperty("data");
    expect(response).toHaveProperty("filteredCount");
  });

  it("calls database with correct sql query for list method with limit and offset arguments", async () => {
    const count = 190;

    const dataset = await getLimitAndOffsetDataset(count, config);

    const service = new TestService(config, database);

    for await (const set of dataset) {
      const { limit, offset } = set();

      const response = await service.list(limit, offset);

      expect(response).toHaveProperty("totalCount");
      expect(response).toHaveProperty("filteredCount");
      expect(response).toHaveProperty("data");
    }
  });

  it("calls database with correct sql queries for list method with filter", async () => {
    const service = new TestService(config, database);

    const limit = 190;

    const filterInputs = getFilterDataset();

    for (const filterInput of filterInputs) {
      const response = await service.list(limit, undefined, filterInput);

      expect(response).toHaveProperty("totalCount");
      expect(response).toHaveProperty("filteredCount");
      expect(response).toHaveProperty("data");
    }
  });

  it("calls database with correct sql queries for list method with sort", async () => {
    const service = new TestService(config, database);

    const limit = 190;

    const sortInputs = getSortDataset();

    for (const sortInput of sortInputs) {
      const response = await service.list(
        limit,
        undefined,
        undefined,
        sortInput,
      );

      expect(response).toHaveProperty("totalCount");
      expect(response).toHaveProperty("filteredCount");
      expect(response).toHaveProperty("data");
    }
  });
});
