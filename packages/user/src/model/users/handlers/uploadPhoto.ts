import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

import CustomApiError from "../../../customApiError";
import getUserService from "../../../lib/getUserService";
import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";

import type { UserUpdateInput } from "../../../types";
import type { Multipart } from "@prefabs.tech/fastify-s3";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const uploadPhoto = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, log, slonik, user } =
    request as FastifyRequest<{
      Body: UserUpdateInput;
    }>;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorised",
      message: "unauthorised",
    });
  }

  try {
    const { photo } = body as {
      photo: Multipart | undefined;
    };

    const service = getUserService(config, slonik, dbSchema);

    if (!photo) {
      throw new CustomApiError({
        message: "Missing photo file in the request body",
        name: "ERROR_FILE_MISSING",
        statusCode: 422,
      });
    }

    const file = await service.uploadPhoto(photo, user.id, user.id);

    const updatedUser = await service.update(user.id, {
      ...(file && {
        photoId: file.id as number,
      }),
    });

    if (user.photoId && user.photoId !== updatedUser.photoId) {
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

export default uploadPhoto;
