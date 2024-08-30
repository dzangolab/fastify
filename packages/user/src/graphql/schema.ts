import { mergeTypeDefs, baseSchema } from "@dzangolab/fastify-graphql";

import invitationSchema from "../model/invitations/schema";
import roleSchema from "../model/roles/schema";
import userSchema from "../model/users/schema";

export default mergeTypeDefs([
  baseSchema,
  invitationSchema,
  roleSchema,
  userSchema,
]);
