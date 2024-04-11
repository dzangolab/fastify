import getUserService from "../../../../lib/getUserService";
import RoleService from "../../../../model/roles/service";

import type {
  Role,
  RoleCreateInput,
  RoleUpdateInput,
  User,
} from "../../../../types";
import type { FastifyError, FastifyInstance } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import type { RecipeInterface } from "supertokens-node/recipe/session/types";

const createNewSession = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): RecipeInterface["createNewSession"] => {
  return async (input) => {
    if (originalImplementation.createNewSession === undefined) {
      throw new Error("Should never come here");
    }

    const request = input.userContext._default.request
      .request as SessionRequest;

    const userService = getUserService(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const user = (await userService.findById(input.userId)) as User;

    const roleService = new RoleService<Role, RoleCreateInput, RoleUpdateInput>(
      request.config,
      request.slonik,
      request.dbSchema
    );

    const roles = await roleService.list(undefined, undefined, {
      OR: user.roles.map(({ role }) => ({
        key: "role",
        operator: "eq",
        value: role,
      })),
    });

    input.accessTokenPayload = {
      ...input.accessTokenPayload,
      "st-role": {
        v: roles.data.map(({ role }) => role),
        t: Date.now(),
      },
      "st-perm": {
        v: [...new Set(roles.data.flatMap(({ permissions }) => permissions))],
        t: Date.now(),
      },
    };

    const originalResponse = await originalImplementation.createNewSession(
      input
    );

    if (user?.disabled) {
      await originalResponse.revokeSession();

      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401,
      } as FastifyError;
    }

    return originalResponse;
  };
};

export default createNewSession;
