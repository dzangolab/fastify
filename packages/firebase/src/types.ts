import notificationHandlers from "./model/notification/handlers";
import deviceHandlers from "./model/userDevice/handlers";

interface FirebaseOptions {
  enabled?: boolean;
  credentials?: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
  };
  routes?: {
    notifications?: {
      disabled: boolean;
    };
    userDevices?: {
      disabled: boolean;
    };
  };
  routePrefix?: string;
  table?: {
    userDevices?: {
      name: string;
    };
  };
  notification?: {
    test?: {
      enabled: boolean;
      path: string;
    };
  };
  handlers?: {
    userDevice?: {
      addUserDevice?: typeof deviceHandlers.addUserDevice;
      removeUserDevice?: typeof deviceHandlers.removeUserDevice;
    };
    notification?: {
      sendNotification?: typeof notificationHandlers.sendNotification;
    };
  };
}

type FirebaseConfig = FirebaseOptions;

interface UserDevice {
  userId: string;
  deviceToken: string;
  createAt: number;
  updatedAt: number;
}

interface User {
  id: string;
}

interface TestNotificationInput {
  userId: string;
  title: string;
  body: string;
  data?: {
    [key: string]: string;
  };
}

type UserDeviceCreateInput = Partial<
  Omit<UserDevice, "userId" | "createdAt" | "updatedAt">
>;

type UserDeviceUpdateInput = Partial<
  Omit<UserDevice, "userId" | "createdAt" | "updatedAt">
>;

export type {
  FirebaseConfig,
  FirebaseOptions,
  TestNotificationInput,
  User,
  UserDevice,
  UserDeviceCreateInput,
  UserDeviceUpdateInput,
};
