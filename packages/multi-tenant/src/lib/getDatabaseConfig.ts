import type { SlonikOptions } from "@dzangolab/fastify-slonik";
import type { ClientConfig } from "pg";

const getDatabaseConfig = (slonikOptions: SlonikOptions): ClientConfig => {
  let clientConfig: ClientConfig = {
    database: slonikOptions.db.databaseName,
    user: slonikOptions.db.username,
    password: slonikOptions.db.password,
    host: slonikOptions.db.host,
    port: slonikOptions.db.port,
  };

  if (slonikOptions.clientConfiguration?.ssl) {
    clientConfig = {
      ...clientConfig,
      ssl: slonikOptions.clientConfiguration?.ssl,
    };
  }

  return clientConfig;
};

export default getDatabaseConfig;
