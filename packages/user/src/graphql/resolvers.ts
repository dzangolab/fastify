import userProfileResolver from "../model/user-profiles/resolver";
import userResolver from "../model/users/resolver";

import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    ...userResolver.Mutation,
  },
  Query: {
    ...userProfileResolver.Query,
  },
};

export default resolvers;
