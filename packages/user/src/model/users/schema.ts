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

  type Users {
    totalCount: Int
    filteredCount: Int
    data: [User]!
  }

  type ChangePasswordResponse {
    statusCode: Int
    status: String
    message: String
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

  input UserUpdateInput {
    id: String
  }

  input SingUpFieldInput {
    email: String!
    password: String!
  }

  type Mutation {
    adminSignUp(data: SingUpFieldInput!): AuthResponse
    disableUser(id: String!): UpdateUserResponse @auth
    enableUser(id: String!): UpdateUserResponse @auth
    changePassword(
      oldPassword: String
      newPassword: String
    ): ChangePasswordResponse @auth
    updateMe(data: UserUpdateInput): User @auth
  }

  type Query {
    canAdminSignUp: CanAdminSignUpResponse
    user(id: String): User @auth
    users(limit: Int, offset: Int, filters: Filters, sort: [SortInput]): Users!
      @auth
    me: User! @auth
  }
`;

export default user;
