import { gql } from "@dzangolab/fastify-mercurius";

const user = gql`
  type User {
    id: String!
    disabled: Boolean!
    email: String!
    lastLoginAt: Float!
    roles: [String]
    signedUpAt: Float!
    timeJoined: Float
  }

  input UserUpdateInput {
    id: String
  }

  type Users {
    totalCount: Int
    filteredCount: Int
    data: [User]!
  }

  type Mutation {
    adminSignUp(data: fieldInput!): AuthResponse
    disableUser(id: String!): UpdateUserResponse @auth
    enableUser(id: String!): UpdateUserResponse @auth
    changePassword(oldPassword: String, newPassword: String): ResponseType @auth
    updateMe(data: UserUpdateInput): User @auth
  }

  type Query {
    canAdminSignUp: CanAdminSignUpResponse
    user(id: String): User @auth
    users(limit: Int, offset: Int, filters: Filters, sort: [SortInput]): Users!
      @auth
    me: User! @auth
  }

  type AuthResponse {
    status: String!
    user: User!
  }

  type CanAdminSignUpResponse {
    signUp: Boolean!
  }

  type UpdateUserResponse {
    status: String!
  }
`;

export default user;
