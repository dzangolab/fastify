import { mergeTypeDefs, baseSchema } from "@dzangolab/fastify-graphql";

import invitationSchema from "../model/invitations/graphql/schema";
import roleSchema from "../model/roles/graphql/schema";
import userSchema from "../model/users/graphql/schema";

export default mergeTypeDefs([
  baseSchema,
  invitationSchema,
  roleSchema,
  userSchema,
]);
