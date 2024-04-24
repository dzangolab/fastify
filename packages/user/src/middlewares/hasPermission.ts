import { Error as STError } from "supertokens-node/recipe/session";

import hasUserPermission from "../lib/hasUserPermission";

import type { SessionRequest } from "supertokens-node/framework/fastify";

const hasPermission =
  (permission: string) =>
  async (request: SessionRequest): Promise<void> => {
    const userId = request.session?.getUserId();

    if (!userId) {
      throw new STError({
        type: "UNAUTHORISED",
        message: "unauthorised",
      });
    }

    if (
      !(await hasUserPermission(
        request.server,
        userId,
        permission,
        request.dbSchema
      ))
    ) {
      // this error tells SuperTokens to return a 403 http response.
      throw new STError({
        type: "INVALID_CLAIMS",
        message: "Not have enough permission",
        payload: [
          {
            id: "st-prem",
            reason: {
              message: "Not have enough permission",
              expectedToInclude: permission,
            },
          },
        ],
      });
    }
  };

export default hasPermission;
