import { gql } from "@dzangolab/fastify-mercurius";

const invitation = gql`
  type Invitation {
    id: Int!
    acceptedAt: Float
    appId: Int
    email: String!
    expiresAt: Float!
    invitedById: String!
    payload: JSON
    revokedAt: Float
    role: String!
    createdAt: Float!
    updatedAt: Float!
  }

  input InvitationCreateInput {
    appId: Int
    email: String!
    expiresAt: String
    payload: JSON
    role: String!
  }

  input InvitationUpdateInput {
    acceptedAt: String
    expiresAt: String
    revokedAt: String
  }

  type Invitations {
    totalCount: Int
    filteredCount: Int
    data: [Invitation]!
  }

  type Mutation {
    acceptInvitation(token: String!, data: fieldInput!): AuthResponse
    createInvitation(data: InvitationCreateInput!): Invitation @auth
    resendInvitation(id: Int!): Invitation @auth
    revokeInvitation(id: Int!): Invitation @auth
  }

  type Query {
    invitations(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): Invitations!
    getInvitationByToken(token: String!): Invitation
  }

  input fieldInput {
    email: String!
    password: String!
  }
`;

export default invitation;
