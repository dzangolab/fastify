import { gql, mergeTypeDefs, baseSchema } from "@dzangolab/fastify-mercurius";

import invitationSchema from "../model/invitations/schema";
import roleSchema from "../model/roles/schema";
import userSchema from "../model/users/schema";

const schema = gql`
  directive @auth on OBJECT | FIELD_DEFINITION
  directive @hasPermission(permission: String!) on OBJECT | FIELD_DEFINITION

  type ResponseType {
    statusCode: Int
    status: String
    message: String
  }

  type Response {
    status: String!
  }
`;

const typeDefs = mergeTypeDefs([
  baseSchema,
  schema,
  invitationSchema,
  roleSchema,
  userSchema,
]);

export default typeDefs;
