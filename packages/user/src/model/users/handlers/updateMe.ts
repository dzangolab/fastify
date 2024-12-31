import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

import getUserService from "../../../lib/getUserService";
import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";
import filterUserUpdateInput from "../filterUserUpdateInput";

import type { UserUpdateInput } from "../../../types";
import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updateMe = async (request: SessionRequest, reply: FastifyReply) => {
  const userId = request.session?.getUserId();

  const input = request.body as UserUpdateInput;

  if (userId) {
    const service = getUserService(
      request.config,
      request.slonik,
      request.dbSchema,
    );

    filterUserUpdateInput(input);

    const user = await service.update(userId, input);

    request.user = user;

    const authUser = await getUserById(userId);

    if (request.config.user.features?.profileValidation?.enabled) {
      await request.session?.fetchAndSetClaim(
        new ProfileValidationClaim(),
        createUserContext(undefined, request),
      );
    }

    const response = {
      ...user,
      thirdParty: authUser?.thirdParty,
    };

    reply.send(response);
  } else {
    request.log.error("could not get user id from session");

    throw new Error("Oops, Something went wrong");
  }
};

export default updateMe;
