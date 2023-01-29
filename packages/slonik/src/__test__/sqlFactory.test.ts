/* istanbul ignore file */
import { describe, expect, it } from "vitest";

import createConfig from "./helpers/createConfig";
import TestSqlFactory from "./helpers/sqlFactory";
import SqlFactory from "../sqlFactory";

import type { SlonikConfig } from "../types";

describe("Test Sql Factory", () => {
  it("returns class default limit", () => {
    const config = createConfig();

    const factory = new TestSqlFactory(config, "test");

    expect(factory.getDefaultLimitPublic()).toBe(SqlFactory.LIMIT_DEFAULT);
  });

  it("returns class max limit", () => {
    const config = createConfig();

    const factory = new TestSqlFactory(config, "test");

    expect(factory.getMaxLimitPublic()).toBe(SqlFactory.LIMIT_MAX);
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

    const factory = new TestSqlFactory(createConfig(config), "test");

    expect(factory.getDefaultLimitPublic()).toBe(
      config.pagination.defaultLimit
    );
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

    const factory = new TestSqlFactory(createConfig(config), "test");

    expect(factory.getMaxLimitPublic()).toBe(config.pagination.maxLimit);
  });
});
