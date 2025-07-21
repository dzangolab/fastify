import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

import CustomApiError from "../../../customApiError";
import getUserService from "../../../lib/getUserService";
import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";

import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const removePhoto = async (request: SessionRequest, reply: FastifyReply) => {
  const { config, dbSchema, log, slonik, user } = request;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorised",
      message: "unauthorised",
    });
  }

  try {
    const service = getUserService(config, slonik, dbSchema);

    // eslint-disable-next-line unicorn/no-null
    const updatedUser = await service.update(user.id, { photoId: null });

    if (user.photoId) {
      await service.fileService.delete(user.photoId);
    }

    request.user = updatedUser;

    const authUser = await getUserById(user.id);

    if (request.config.user.features?.profileValidation?.enabled) {
      await request.session?.fetchAndSetClaim(
        new ProfileValidationClaim(),
        createUserContext(undefined, request),
      );
    }

    const response = {
      ...updatedUser,
      thirdParty: authUser?.thirdParty,
    };

    reply.send(response);
  } catch (error) {
    if (error instanceof CustomApiError) {
      reply.status(error.statusCode);

      return reply.send({
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
      });
    }

    log.error(error);

    return reply.status(500).send({
      message: "Oops! Something went wrong",
      status: "ERROR",
      statusCode: 500,
    });
  }
};

export default removePhoto;
