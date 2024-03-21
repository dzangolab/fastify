import UserService from "../model/users/service";

import type { User, UserCreateInput, UserUpdateInput } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

const getUserService = (
  config: ApiConfig,
  slonik: Database,
  dbSchema?: string
) => {
  const Service = config.user.services?.user || UserService;

  return new Service<User & QueryResultRow, UserCreateInput, UserUpdateInput>(
    config,
    slonik,
    dbSchema
  );
};

export default getUserService;
