import { gql } from "@dzangolab/fastify-mercurius";

const role = gql`
  type Role {
    role: String!
    permissions: [String]!
  }

  type UpdateRolePermissionsResponse {
    status: String!
    permissions: [String]!
  }

  type Mutation {
    createRole(role: String!, permissions: [String]): Response! @auth
    deleteRole(role: String!): Response! @auth
    updateRolePermissions(
      role: String!
      permissions: [String]!
    ): UpdateRolePermissionsResponse! @auth
  }

  type Query {
    permissions: [String]! @auth
    roles: [Role]! @auth
    rolePermissions(role: String!): [String]! @auth
  }
`;
export default role;
