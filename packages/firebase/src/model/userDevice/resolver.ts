import mercurius, { MercuriusContext } from "mercurius";

import Service from "./service";

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

    if (config.firebase.enabled === false) {
      return new mercurius.ErrorWithProps("Firebase is not enabled", {}, 404);
    }

    if (!userId) {
      return new mercurius.ErrorWithProps("Could not get user id", {}, 403);
    }

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
  },
  removeUserDevice: async (
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

    if (config.firebase.enabled === false) {
      return new mercurius.ErrorWithProps("Firebase is not enabled", {}, 404);
    }

    if (!userId) {
      return new mercurius.ErrorWithProps("Could not get user id", {}, 403);
    }

    try {
      const { deviceToken } = arguments_.data;

      const service = new Service(config, database, dbSchema);

      const userDevices = await service.getByUserId(userId);

      if (!userDevices || userDevices.length === 0) {
        return new mercurius.ErrorWithProps(
          "No devices found for user",
          {},
          403
        );
      }

      const deviceToDelete = userDevices.find(
        (device) => device.deviceToken === deviceToken
      );

      if (!deviceToDelete) {
        return new mercurius.ErrorWithProps(
          "Device requested to delete not owned by user",
          {},
          403
        );
      }

      return await service.removeByDeviceToken(deviceToken);
    } catch (error) {
      app.log.error(error);

      const mercuriusError = new mercurius.ErrorWithProps(
        "Oops, Something went wrong"
      );
      mercuriusError.statusCode = 500;

      return mercuriusError;
    }
  },
};

const Query = {};

export default { Mutation, Query };
