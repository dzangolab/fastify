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

export const sendNotificationSchema = {
  body: {
    type: "object",
    properties: {
      title: { type: "string" },
      message: { type: "string" },
      userId: { type: "string" },
    },
    required: ["title", "message", "userId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthorized",
      ...errorSchema,
    },
    500: {
      ...errorSchema,
    },
  },
  tags: ["notifications"],
};
