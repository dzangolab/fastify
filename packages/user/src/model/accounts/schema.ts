import { gql } from "@dzangolab/fastify-mercurius";

const accountSchema = gql`
  input AccountCreateInput {
    organizationId: Int!
    name: String
    slug: String
  }

  input AccountUpdateInput {
    organizationId: Int
    name: String
  }

  type Mutation {
    createAccount(data: AccountCreateInput!): Account @auth
    deleteAccount(id: Int!): Account @auth
    updateAccount(id: Int!, data: AccountUpdateInput!): Account @auth
  }

  type Accounts {
    totalCount: Int
    filteredCount: Int
    data: [Account]!
  }

  type Account {
    id: Int
    organizationId: Int
    name: String
    slug: String
  }

  type Query {
    accounts(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): Accounts! @auth
    account(id: Int!): Account @auth
  }
`;

export default accountSchema;
