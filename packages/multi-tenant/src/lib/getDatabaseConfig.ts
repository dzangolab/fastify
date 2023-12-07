import type { SlonikConfig } from "@dzangolab/fastify-slonik";
import type { ClientConfig } from "pg";

const getDatabaseConfig = (slonikConfig: SlonikConfig): ClientConfig => {
  let clientConfig: ClientConfig = {
    database: slonikConfig.db.databaseName,
    user: slonikConfig.db.username,
    password: slonikConfig.db.password,
    host: slonikConfig.db.host,
    port: slonikConfig.db.port,
  };

  if (slonikConfig.clientConfiguration?.ssl) {
    clientConfig = {
      ...clientConfig,
      ssl: slonikConfig.clientConfiguration?.ssl,
    };
  }

  return clientConfig;
};

export default getDatabaseConfig;
