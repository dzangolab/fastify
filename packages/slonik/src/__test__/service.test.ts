/* istanbul ignore file */
import { afterEach, describe, expect, it, vi } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";
import TestService from "./helpers/testService";
import BaseService from "../service";

import type { SlonikConfig } from "../types";

const query = vi.fn();

describe("Service", () => {
  const database = createDatabase(query);

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

  // it("provide valid sql when all", async () => {
  //   const config = createConfig();

  //   const service = new TestService(config, database);

  //   await service.all(["id"]);

  //   expect(queryFn).toHaveBeenCalledWith(`SELECT id FROM "${service.table}";`);
  // });

  // it("provide valid sql when create", async () => {
  //   const config = createConfig();

  //   const service = new TestService(config, database);

  //   await service.create({ name: "Myname" });

  //   expect(query).toHaveBeenCalledWith(
  //     `INERT INTO "${service.table}" ('name') VALUES ('Myname');`
  //   );
  // });
});
