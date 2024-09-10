import InvitationService from "../model/invitations/service";

import type {
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
} from "../types/invitation";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

const getInvitationService = (
  config: ApiConfig,
  slonik: Database,
  dbSchema?: string
) => {
  const Service = config.user.services?.invitation || InvitationService;

  return new Service<
    Invitation & QueryResultRow,
    InvitationCreateInput,
    InvitationUpdateInput
  >(config, slonik, dbSchema);
};

export default getInvitationService;
