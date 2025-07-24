import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

import CustomApiError from "../../../customApiError";
import getUserService from "../../../lib/getUserService";
import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";
import filterUserUpdateInput from "../filterUserUpdateInput";

import type { UserUpdateInput } from "../../../types";
import type { File } from "@prefabs.tech/fastify-s3";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updateMe = async (request: SessionRequest, reply: FastifyReply) => {
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
    let file: File | undefined;
    const { photo, ...input } = body as UserUpdateInput;

    const service = getUserService(config, slonik, dbSchema);

    filterUserUpdateInput(input);

    if (photo) {
      file = await service.uploadPhoto(photo, user.id, user.id);
    }

    const updatedUser = await service.update(user.id, {
      ...input,
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

export default updateMe;
