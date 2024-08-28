(function(e,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("fastify-plugin"),require("mercurius"),require("graphql-tag"),require("@graphql-tools/merge")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","mercurius","graphql-tag","@graphql-tools/merge"],n):(e=typeof globalThis<"u"?globalThis:e||self,n(e.DzangolabFastifyGraphql={},e.FastifyPlugin,e.Mercurius,e.graphqlTag,e.merge))})(this,function(e,n,l,r,u){"use strict";const s=async(i,t)=>{const o=i.config.graphql.plugins,a={config:i.config,database:i.slonik,dbSchema:i.dbSchema};if(o)for(const p of o)await p.updateContext(a,i,t);return a},g=n(async i=>{const t=i.config.graphql;t?.enabled?await i.register(l,{context:s,...t}):i.log.info("GraphQL API not enabled")}),c=r.gql`
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
`;Object.defineProperty(e,"gql",{enumerable:!0,get:()=>r.gql}),Object.defineProperty(e,"mergeTypeDefs",{enumerable:!0,get:()=>u.mergeTypeDefs}),e.baseSchema=c,e.default=g,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
