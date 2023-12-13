import mercurius, { MercuriusContext } from "mercurius";
import "@dzangolab/fastify-mercurius";

import Service from "./service";

// import type { MercuriusContext } from "mercurius";

const Mutation = {
  addUserDevice: async (
    parent: unknown,
    arguments_: {
      data: {
        deviceToken: string;
      };
    },
    context: MercuriusContext
  ) => {
    const { app, config, dbSchema, database, user } = context;
    const userId = user?.id;

    if (userId) {
      try {
        const { deviceToken } = arguments_.data;

        const service = new Service(config, database, dbSchema);

        return await service.create({ userId, deviceToken });
      } catch (error) {
        app.log.error(error);

        const mercuriusError = new mercurius.ErrorWithProps(
          "Oops, Something went wrong"
        );
        mercuriusError.statusCode = 500;

        return mercuriusError;
      }
    } else {
      return new mercurius.ErrorWithProps("Could not get user id", {}, 403);
    }
  },
};

const Query = {};

export default { Mutation, Query };
