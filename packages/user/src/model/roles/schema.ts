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

export const deleteRoleSchema = {
  querystring: {
    type: "object",
    properties: {
      role: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Role deleted successfully",
      properties: {
        status: { type: "string" },
      },
      type: "object",
    },
    401: {
      description: "Unauthorized",
      ...errorSchema,
    },
    403: {
      description: "Forbidden",
      ...errorSchema,
    },
    422: {
      description: "Unprocessable Entity",
      ...errorSchema,
    },
    500: {
      ...errorSchema,
    },
  },
  tags: ["roles"],
};

export const getRolesSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        roles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string" },
              permissions: {
                type: "array",
                items: { type: "string" },
              },
            },
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
  tags: ["roles"],
};

export const createRoleSchema = {
  body: {
    type: "object",
    required: ["role"],
    properties: {
      role: { type: "string" },
      permissions: {
        type: "array",
        items: { type: "string" },
      },
    },
  },
  response: {
    201: {
      description: "Role created successfully",
      type: "object",
      properties: {
        status: { type: "string" },
      },
    },
    400: {
      description: "Bad Request",
      ...errorSchema,
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
  tags: ["roles"],
};

export const updateRoleSchema = {
  body: {
    type: "object",
    required: ["role"],
    properties: {
      role: { type: "string" },
      permissions: {
        type: "array",
        items: { type: "string" },
      },
    },
  },
  response: {
    200: {
      description: "Role updated successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        permissions: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
    400: {
      description: "Bad Request",
      ...errorSchema,
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
  tags: ["roles"],
};

export const getRolePermissionsSchema = {
  querystring: {
    type: "object",
    properties: {
      role: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Role permissions retrieved successfully",
      type: "object",
      properties: {
        permissions: {
          type: "array",
          items: { type: "string" },
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
    404: {
      description: "Role not found",
      ...errorSchema,
    },
    500: {
      ...errorSchema,
    },
  },
  tags: ["roles"],
};
