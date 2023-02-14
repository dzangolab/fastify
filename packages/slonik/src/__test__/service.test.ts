/* istanbul ignore file */
import { sql } from "slonik";
import { afterEach, describe, expect, it, vi } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase, { removeExtraSpace } from "./helpers/createDatabase";
import TestService from "./helpers/testService";
import BaseService from "../service";

import type { SlonikConfig } from "../types";

const getSqlStatement = () => sql`SELECT "test"`;

const getAllSql = vi.fn(getSqlStatement);
const getCreateSql = vi.fn(getSqlStatement);
const getDeleteSql = vi.fn(getSqlStatement);

vi.mock("../sqlFactory", () => ({
  default: class DefaultSqlFactory {
    getAllSql = getAllSql;
    getCreateSql = getCreateSql;
    getDeleteSql = getDeleteSql;
  },
}));

describe("Service", () => {
  const database = createDatabase(vi.fn());

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

  it("calls getAllSql from sqlFactory with correct input", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = ["id", "name"];

    await service.all(data);

    // const allQuery = service.factory.getAllSql(["id", "name"]);

    expect(getAllSql).toHaveBeenCalledWith(data);
  });

  it("calls getCreateSql from sqlFactory with correct input", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = { name: "Thing", value: 100 };

    await service.create(data);

    expect(getCreateSql).toHaveBeenCalledWith(data);
  });

  it("calls getDeleteSql from sqlFactory with correct input", async () => {
    const config = createConfig();

    const service = new TestService(config, database);

    const data = 10;

    await service.delete(data);

    expect(getDeleteSql).toHaveBeenCalledWith(data);
  });

  // it("provide valid sql for findById() method", async () => {
  //   const config = createConfig();

  //   const service = new TestService(config, database);

  //   await service.findById(10);

  //   expect(query).toHaveBeenCalledWith(
  //     removeExtraSpace(
  //       `SELECT * FROM "${service.schema}"."${service.table}"
  //         WHERE id = $1;
  //       `
  //     ),
  //     [10]
  //   );
  // });

  // it("provide valid sql for list() method", async () => {
  //   const config = createConfig();

  //   const service = new TestService(config, database);

  //   await service.list();

  //   expect(query).toHaveBeenCalledWith(
  //     removeExtraSpace(
  //       `SELECT * FROM
  //        "${service.schema}"."${service.table}"  ORDER BY id ASC LIMIT $1;
  //       `
  //     ),
  //     [Math.min(service.getLimitDefault(), service.getLimitMax())]
  //   );
  // });

  // it("provide valid sql for update() method", async () => {
  //   const config = createConfig();

  //   const service = new TestService(config, database);

  //   await service.update(10, { name: "Test1" });

  //   expect(query).toHaveBeenCalledWith(
  //     removeExtraSpace(
  //       `UPDATE "${service.schema}"."${service.table}"
  //         SET "name" = $1
  //         WHERE id = $2 RETURNING *;
  //       `
  //     ),
  //     ["Test1", 10]
  //   );
  // });

  // it("provide valid sql for all() method with scheam change", async () => {
  //   const config = createConfig();

  //   const service = new TestService(config, database, "tenant1");

  //   await service.all(["id", "name"]);

  //   expect(query).toHaveBeenCalledWith(
  //     removeExtraSpace(
  //       `SELECT "id", "name"
  //         FROM "${service.schema}"."${service.table}"
  //         ORDER BY id ASC;
  //       `
  //     ),
  //     []
  //   );
  // });
});
