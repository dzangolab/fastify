import { mergeTypeDefs, baseSchema } from "@dzangolab/fastify-mercurius";

import accountSchema from "../model/accounts/schema";
import invitationSchema from "../model/invitations/schema";
import organizationSchema from "../model/organizations/schema";
import roleSchema from "../model/roles/schema";
import userSchema from "../model/users/schema";

export default mergeTypeDefs([
  accountSchema,
  baseSchema,
  invitationSchema,
  roleSchema,
  userSchema,
  organizationSchema,
]);
