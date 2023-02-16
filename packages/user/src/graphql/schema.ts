import { gql } from "mercurius-codegen";

const schema = gql`
  directive @auth on OBJECT | FIELD_DEFINITION

  input Filters {
    AND: [Filters]
    OR: [Filters]
    not: Boolean
    key: String
    operator: String
    value: String
  }

  enum SortDirection {
    ASC
    DESC
  }

  input SortInput {
    key: String
    direction: SortDirection
  }

  type Query {
    user(id: String): User @auth
    users(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): [User]! @auth
  }

  type Mutation {
    changePassword(oldPassword: String, newPassword: String): responseType
  }

  type User {
    givenName: String
    id: String
    middleNames: String
    surname: String
  }
`;

export default schema;
