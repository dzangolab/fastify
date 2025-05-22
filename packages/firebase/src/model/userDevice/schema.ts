const errorSchema = {
  type: "object",
  properties: {
    code: { type: "string" },
    error: { type: "object" },
    message: { type: "string" },
    statusCode: { type: "number" },
    status: { type: "string" },
  },
};

const userDeviceSchema = {
  type: "object",
  properties: {
    userId: { type: "string" },
    deviceToken: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
  required: ["userId", "deviceToken", "createdAt", "updatedAt"],
};

export const deleteUserDeviceSchema = {
  description: "Delete a user device by device token",
  operationId: "deleteUserDevice",
  body: {
    type: "object",
    properties: {
      deviceToken: { type: "string" },
    },
    required: ["deviceToken"],
  },
  response: {
    200: {
      ...userDeviceSchema,
      nullable: true,
    },
    401: {
      description: "Unauthorized",
      ...errorSchema,
    },
    500: {
      ...errorSchema,
    },
  },
  tags: ["user-devices"],
};

export const postUserDeviceSchema = {
  description: "Register a new user device",
  operationId: "postUserDevice",
  body: {
    type: "object",
    properties: {
      deviceToken: { type: "string" },
    },
    required: ["deviceToken"],
  },
  response: {
    200: {
      ...userDeviceSchema,
      nullable: true,
    },
    401: {
      description: "Unauthorized",
      ...errorSchema,
    },
    500: {
      ...errorSchema,
    },
  },
  tags: ["user-devices"],
};
