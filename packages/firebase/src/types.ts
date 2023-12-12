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

type UserDeviceCreateInput = Partial<
  Omit<UserDevice, "userId" | "createdAt" | "updatedAt">
>;

type UserDeviceUpdateInput = Partial<
  Omit<UserDevice, "userId" | "createdAt" | "updatedAt">
>;

export type {
  Message,
  UserDevice,
  UserDeviceCreateInput,
  UserDeviceUpdateInput,
};
