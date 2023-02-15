import mercurius from "mercurius";

import Service from "./service";

import type { MercuriusContext } from "mercurius";

const Mutation = {
  changePassword: async (
    parent: unknown,
    arguments_: {
      oldPassword: string;
      newPassword: string;
    },
    context: MercuriusContext
  ) => {
    const service = new Service();

    try {
      if (context.user?.id) {
        const changePasswordResponse = await service.changePassword(
          context.user?.id,
          arguments_.oldPassword,
          arguments_.newPassword
        );

        return changePasswordResponse;
      } else {
        return {
          status: "NOT_FOUND",
          message: "User not found",
        };
      }
    } catch (error) {
      // FIXME [OP 28 SEP 2022]
      console.log(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );
      mercuriusError.statusCode = 500;
      return mercuriusError;
    }
  },
};

export default { Mutation };
