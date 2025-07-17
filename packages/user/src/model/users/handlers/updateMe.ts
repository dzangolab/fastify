import { getUserById } from "supertokens-node/recipe/thirdpartyemailpassword";

import CustomApiError from "../../../customApiError";
import getUserService from "../../../lib/getUserService";
import createUserContext from "../../../supertokens/utils/createUserContext";
import ProfileValidationClaim from "../../../supertokens/utils/profileValidationClaim";
import filterUserUpdateInput from "../filterUserUpdateInput";

import type { UserUpdateInput } from "../../../types";
import type { Multipart } from "@dzangolab/fastify-s3";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

const updateMe = async (request: SessionRequest, reply: FastifyReply) => {
  const { body, config, dbSchema, log, slonik, user } =
    request as FastifyRequest<{
      Body: UserUpdateInput & {
        file: Multipart | undefined;
      };
    }>;

  if (!user) {
    return reply.status(401).send({
      error: "Unauthorised",
      message: "unauthorised",
    });
  }

  try {
    const { file, ...input } = body;

    const service = getUserService(config, slonik, dbSchema);

    filterUserUpdateInput(input);

    let result;

    if (file) {
      result = await service.upload({
        file: {
          fileContent: file,
          fileFields: {
            uploadedById: user.id,
            uploadedAt: Date.now(),
            bucket: "users",
          },
        },
        options: {
          bucket: "users",
        },
      });
    }

    const updatedUser = await service.update(user.id, {
      ...input,
      ...(result && {
        profilePictureId: result.id as number,
      }),
    });

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
