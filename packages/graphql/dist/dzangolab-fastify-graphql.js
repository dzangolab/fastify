import r from "fastify-plugin";
import a from "mercurius";
import { gql as l } from "graphql-tag";
import { gql as D } from "graphql-tag";
import { mergeTypeDefs as h } from "@graphql-tools/merge";
const c = async (o, t) => {
  const n = o.config.graphql.plugins, i = {
    config: o.config,
    database: o.slonik,
    dbSchema: o.dbSchema
  };
  if (n)
    for (const e of n)
      await e.updateContext(i, o, t);
  return i;
}, s = async (o) => {
  const t = o.config.graphql;
  t?.enabled ? await o.register(a, {
    context: c,
    ...t
  }) : o.log.info("GraphQL API not enabled");
}, u = r(s), f = l`
  directive @auth(profileValidation: Boolean) on OBJECT | FIELD_DEFINITION
  directive @hasPermission(permission: String!) on OBJECT | FIELD_DEFINITION

  scalar DateTime
  scalar JSON

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

  type DeleteResult {
    result: Boolean!
  }
`;
export {
  f as baseSchema,
  u as default,
  D as gql,
  h as mergeTypeDefs
};
