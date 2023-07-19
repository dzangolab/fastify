import formatDate from "../../../supertokens/utils/formatDate";

import type { ApiConfig } from "@dzangolab/fastify-config";

const expireAfterInDays = 30;

const computeInvitationExpiresAt = (config: ApiConfig, expireTime?: string) => {
  return (expireTime ||
    formatDate(
      new Date(
        Date.now() +
          (config.user.invitation?.expireAfterInDays ?? expireAfterInDays) *
            (24 * 60 * 60 * 1000)
      )
    )) as string;
};

export default computeInvitationExpiresAt;
