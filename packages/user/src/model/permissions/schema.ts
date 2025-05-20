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

export const getPermissionsSchema = {
  description: "Get all available permissions",
  operationId: "getPermissions",
  response: {
    200: {
      type: "object",
      properties: {
        permissions: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
      ...errorSchema,
    },
    403: {
      description: "Forbidden",
      ...errorSchema,
    },
    500: {
      ...errorSchema,
    },
  },
  tags: ["permissions"],
};
