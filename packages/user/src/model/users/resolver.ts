import graphql from "./lib/graphql";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  changePassword: async (
    parent: unknown,
    arguments_: {
      oldPassword: string;
      newPassword: string;
    },
    context: MercuriusContext
  ) => {
    const changePassword =
      context.config.user.graphql?.resolver?.mutation?.changePassword;

    if (changePassword) {
      return await changePassword(parent, arguments_, context);
    }

    return await graphql.Mutation.changePassword(parent, arguments_, context);
  },
};

const Query = {
  me: async (
    parent: unknown,
    arguments_: Record<string, never>,
    context: MercuriusContext
  ) => {
    const me = context.config.user.graphql?.resolver?.query?.me;

    if (me) {
      return await me(parent, arguments_, context);
    }

    return await graphql.Query.me(parent, arguments_, context);
  },

  user: async (
    parent: unknown,
    arguments_: { id: string },
    context: MercuriusContext
  ) => {
    const user = context.config.user.graphql?.resolver?.query?.user;

    if (user) {
      return await user(parent, arguments_, context);
    }

    return await graphql.Query.user(parent, arguments_, context);
  },

  users: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext
  ) => {
    const users = context.config.user.graphql?.resolver?.query?.users;

    if (users) {
      return await users(parent, arguments_, context);
    }

    return await graphql.Query.users(parent, arguments_, context);
  },
};

export default { Mutation, Query };
