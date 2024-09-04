import { BaseService as p } from "@dzangolab/fastify-slonik";
import { gql as z } from "graphql-tag";
import O from "fastify-plugin";
import { sql as d } from "slonik";
const g = "organizations";
class e extends p {
  static TABLE = g;
}
const y = async (n, a) => {
  const i = new e(n.config, n.slonik), t = n.body, o = await i.create(t);
  a.send(o);
}, I = async (n, a) => {
  const i = new e(n.config, n.slonik), { id: t } = n.params, o = await i.delete(t);
  a.send(o);
}, S = async (n, a) => {
  const i = new e(n.config, n.slonik), { limit: t, offset: o, filters: s, sort: c } = n.query, l = await i.list(
    t,
    o,
    s ? JSON.parse(s) : void 0,
    c ? JSON.parse(c) : void 0
  );
  a.send(l);
}, u = async (n, a) => {
  const i = new e(n.config, n.slonik), { id: t } = n.params, o = await i.findById(t);
  a.send(o);
}, v = async (n, a) => {
  const i = new e(n.config, n.slonik), { id: t } = n.params, o = n.body, s = await i.update(t, o);
  a.send(s);
}, r = {
  createOrganization: y,
  deleteOrganization: I,
  listOrganization: S,
  organization: u,
  updateOrganization: v
}, T = async (n, a, i) => {
  const t = n.config.organization?.handlers?.organization;
  n.get(
    "/organizations",
    {
      preHandler: n.verifySession()
    },
    t?.list || r.listOrganization
  ), n.get(
    "/organizations/:id(^\\d+)",
    {
      preHandler: n.verifySession()
    },
    t?.organization || r.organization
  ), n.delete(
    "/organizations/:id(^\\d+)",
    {
      preHandler: n.verifySession()
    },
    t?.delete || r.deleteOrganization
  ), n.post(
    "/organizations",
    {
      preHandler: n.verifySession()
    },
    t?.create || r.createOrganization
  ), n.put(
    "/organizations/:id(^\\d+)",
    {
      preHandler: n.verifySession()
    },
    t?.update || r.updateOrganization
  ), i();
}, f = {
  createOrganization: async (n, a, i) => {
    const t = new e(i.config, i.database);
    try {
      if (!i.user)
        throw new Error("UserId not found in session.");
      return await t.create(
        a.data
      );
    } catch (o) {
      console.log(o);
    }
  },
  deleteOrganization: async (n, a, i) => {
    const t = new e(i.config, i.database);
    try {
      return await t.delete(a.id);
    } catch (o) {
      console.log(o);
    }
  },
  updateOrganization: async (n, a, i) => {
    const t = new e(i.config, i.database);
    try {
      return await t.update(
        a.id,
        a.data
      );
    } catch (o) {
      console.log(o);
    }
  }
}, w = {
  organization: async (n, a, i) => await new e(i.config, i.database).findById(a.id),
  organizations: async (n, a, i) => await new e(i.config, i.database).list(
    a.limit,
    a.offset,
    a.filters ? JSON.parse(JSON.stringify(a.filters)) : void 0,
    a.sort ? JSON.parse(JSON.stringify(a.sort)) : void 0
  )
}, b = { Mutation: f, Query: w }, B = z`
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
`, A = () => d.unsafe`
    CREATE TABLE IF NOT EXISTS ${d.identifier([g])} (
      "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      "billing_address" VARCHAR(255),
      "name" VARCHAR(255),
      "schema" VARCHAR(63) DEFAULT 'public',
      "tax_id" VARCHAR(255),
      "tenant" BOOLEAN,
      "type_id" INTEGER
    );
  `, E = async (n) => {
  await n.connect(async (a) => {
    await a.query(A());
  });
}, C = O(
  async (n, a, i) => {
    const { log: t, slonik: o } = n;
    t.info("Registering billing-fastify plugin"), await E(o), i();
  }
);
export {
  C as default,
  b as organizationResolver,
  T as organizationRoutes,
  B as organizationSchema,
  e as organizationService
};
