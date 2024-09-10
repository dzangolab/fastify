import { createPool } from "slonik";
import { vi } from "vitest";

import type { ClientConfigurationInput } from "slonik";
import type { ConnectionPoolClient } from "slonik/dist/factories/createConnectionPool";
import type { MockInstance } from "vitest";

export const createPoolWithSpy = async (
  dsn: string,
  { driverFactory, ...configuration }: ClientConfigurationInput,
) => {
  const spy = {} as {
    acquire?: MockInstance;
    destroy?: MockInstance;
    query?: MockInstance;
    release?: MockInstance;
  };

  let connection: ConnectionPoolClient;

  const pool = await createPool(dsn, {
    driverFactory: async (...arguments_) => {
      if (!driverFactory) {
        throw new Error("Driver is required");
      }

      const driver = await driverFactory(...arguments_);

      return {
        createClient: async () => {
          if (connection) {
            return connection;
          }

          // We are re-using the same connection for all queries
          // as it makes it easier to spy on the connection.
          // eslint-disable-next-line require-atomic-updates
          connection = await driver.createClient();

          spy.acquire = vi.spyOn(connection, "acquire");
          spy.destroy = vi.spyOn(connection, "destroy");
          spy.query = vi.spyOn(connection, "query");
          spy.release = vi.spyOn(connection, "release");

          return connection;
        },
      };
    },
    ...configuration,
  });

  return {
    pool,
    spy,
  };
};
