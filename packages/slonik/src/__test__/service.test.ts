/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import createConfig from "./helpers/createConfig";
import createDatabase from "./helpers/createDatabase";
import Service from "../service";

import type { SlonikConfig } from "../types";

describe("Service", () => {
  const database = createDatabase();

  it("returns class default limit", () => {
    const config = createConfig();

    const service = new Service(config, database, "test");

    expect(service.getLimitDefault()).toBe(Service.LIMIT_DEFAULT);
  });

  it("returns class max limit", () => {
    const config = createConfig();

    const service = new Service(config, database, "test");

    expect(service.getLimitMax()).toBe(Service.LIMIT_MAX);
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

    const service = new Service(createConfig(config), database, "test");

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

    const service = new Service(createConfig(config), database, "test");

    expect(service.getLimitMax()).toBe(config.pagination.maxLimit);
  });
});
