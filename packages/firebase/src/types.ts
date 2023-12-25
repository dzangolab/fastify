interface Message {
  tokens: string[];
  notification: {
    title: string;
    body: string;
  };
  data?: {
    [key: string]: string;
  };
}
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
  Message,
  TestNotificationInput,
  User,
  UserDevice,
  UserDeviceCreateInput,
  UserDeviceUpdateInput,
};
