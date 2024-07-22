import { gql } from "@dzangolab/fastify-mercurius";

const organizationSchema = gql`
  input OrganizationCreateInput {
    billingAddress: String
    name: String
    schema: String
    taxId: String
    tenant: Boolean
    typeId: Int
  }

  input OrganizationUpdateInput {
    billingAddress: String
    name: String
    taxId: String
    typeId: Int
  }

  type Mutation {
    createOrganization(data: OrganizationCreateInput!): Organization @auth
    deleteOrganization(id: Int!): Organization @auth
    updateOrganization(id: Int!, data: OrganizationUpdateInput!): Organization
      @auth
  }

  type Organizations {
    totalCount: Int
    filteredCount: Int
    data: [Organization]!
  }

  type Organization {
    id: String!
    billingAddress: String!
    name: String!
    schema: String
    taxId: String
    tenant: Boolean
    typeId: Int!
  }

  type Query {
    organizations(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): Organizations! @auth
    organization(id: Int!): Organization @auth
  }
`;

export default organizationSchema;
