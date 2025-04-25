import InvitationService from "../model/invitations/service";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const getInvitationService = (
  config: ApiConfig,
  slonik: Database,
  dbSchema?: string,
) => {
  const Service = config.user.services?.invitation || InvitationService;

  return new Service(config, slonik, dbSchema);
};

export default getInvitationService;
