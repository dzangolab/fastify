import UserService from "../model/users/graphql/service";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const getUserService = (
  config: ApiConfig,
  slonik: Database,
  dbSchema?: string,
) => {
  const Service = config.user.services?.user || UserService;

  return new Service(config, slonik, dbSchema);
};

export default getUserService;
