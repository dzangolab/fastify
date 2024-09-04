import { BaseService as C } from "@dzangolab/fastify-slonik";
import F from "fastify-plugin";
import L from "mercurius";
import { parse as j } from "graphql";
import { sql as z } from "slonik";
const x = "organizations";
class u extends C {
  static TABLE = x;
}
const _ = async (e, n) => {
  const i = new u(e.config, e.slonik), t = e.body, r = await i.create(t);
  n.send(r);
}, H = async (e, n) => {
  const i = new u(e.config, e.slonik), { id: t } = e.params, r = await i.delete(t);
  n.send(r);
}, U = async (e, n) => {
  const i = new u(e.config, e.slonik), { limit: t, offset: r, filters: o, sort: l } = e.query, O = await i.list(
    t,
    r,
    o ? JSON.parse(o) : void 0,
    l ? JSON.parse(l) : void 0
  );
  n.send(O);
}, J = async (e, n) => {
  const i = new u(e.config, e.slonik), { id: t } = e.params, r = await i.findById(t);
  n.send(r);
}, $ = async (e, n) => {
  const i = new u(e.config, e.slonik), { id: t } = e.params, r = e.body, o = await i.update(t, r);
  n.send(o);
}, g = {
  createOrganization: _,
  deleteOrganization: H,
  listOrganization: U,
  organization: J,
  updateOrganization: $
}, ye = async (e, n, i) => {
  const t = e.config.organization?.handlers?.organization;
  e.get(
    "/organizations",
    {
      preHandler: e.verifySession()
    },
    t?.list || g.listOrganization
  ), e.get(
    "/organizations/:id(^\\d+)",
    {
      preHandler: e.verifySession()
    },
    t?.organization || g.organization
  ), e.delete(
    "/organizations/:id(^\\d+)",
    {
      preHandler: e.verifySession()
    },
    t?.delete || g.deleteOrganization
  ), e.post(
    "/organizations",
    {
      preHandler: e.verifySession()
    },
    t?.create || g.createOrganization
  ), e.put(
    "/organizations/:id(^\\d+)",
    {
      preHandler: e.verifySession()
    },
    t?.update || g.updateOrganization
  ), i();
}, Q = {
  createOrganization: async (e, n, i) => {
    const t = new u(i.config, i.database);
    try {
      if (!i.user)
        throw new Error("UserId not found in session.");
      return await t.create(
        n.data
      );
    } catch (r) {
      console.log(r);
    }
  },
  deleteOrganization: async (e, n, i) => {
    const t = new u(i.config, i.database);
    try {
      return await t.delete(n.id);
    } catch (r) {
      console.log(r);
    }
  },
  updateOrganization: async (e, n, i) => {
    const t = new u(i.config, i.database);
    try {
      return await t.update(
        n.id,
        n.data
      );
    } catch (r) {
      console.log(r);
    }
  }
}, M = {
  organization: async (e, n, i) => await new u(i.config, i.database).findById(n.id),
  organizations: async (e, n, i) => await new u(i.config, i.database).list(
    n.limit,
    n.offset,
    n.filters ? JSON.parse(JSON.stringify(n.filters)) : void 0,
    n.sort ? JSON.parse(JSON.stringify(n.sort)) : void 0
  )
}, Se = { Mutation: Q, Query: M }, G = async (e, n) => {
  const i = e.config.graphql.plugins, t = {
    config: e.config,
    database: e.slonik,
    dbSchema: e.dbSchema
  };
  if (i)
    for (const r of i)
      await r.updateContext(t, e, n);
  return t;
}, P = async (e) => {
  const n = e.config.graphql;
  n?.enabled ? await e.register(L, {
    context: G,
    ...n
  }) : e.log.info("GraphQL API not enabled");
};
F(P);
var y = function() {
  return y = Object.assign || function(e) {
    for (var n, i = 1, t = arguments.length; i < t; i++) {
      n = arguments[i];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, y.apply(this, arguments);
}, f = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), k = !0, S = !1;
function R(e) {
  return e.replace(/[\s,]+/g, " ").trim();
}
function Y(e) {
  return R(e.source.body.substring(e.start, e.end));
}
function W(e) {
  var n = /* @__PURE__ */ new Set(), i = [];
  return e.definitions.forEach(function(t) {
    if (t.kind === "FragmentDefinition") {
      var r = t.name.value, o = Y(t.loc), l = T.get(r);
      l && !l.has(o) ? k && console.warn("Warning: fragment with name " + r + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : l || T.set(r, l = /* @__PURE__ */ new Set()), l.add(o), n.has(o) || (n.add(o), i.push(t));
    } else
      i.push(t);
  }), y(y({}, e), { definitions: i });
}
function K(e) {
  var n = new Set(e.definitions);
  n.forEach(function(t) {
    t.loc && delete t.loc, Object.keys(t).forEach(function(r) {
      var o = t[r];
      o && typeof o == "object" && n.add(o);
    });
  });
  var i = e.loc;
  return i && (delete i.startToken, delete i.endToken), e;
}
function q(e) {
  var n = R(e);
  if (!f.has(n)) {
    var i = j(e, {
      experimentalFragmentVariables: S,
      allowLegacyFragmentVariables: S
    });
    if (!i || i.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    f.set(n, K(W(i)));
  }
  return f.get(n);
}
function p(e) {
  for (var n = [], i = 1; i < arguments.length; i++)
    n[i - 1] = arguments[i];
  typeof e == "string" && (e = [e]);
  var t = e[0];
  return n.forEach(function(r, o) {
    r && r.kind === "Document" ? t += r.loc.source.body : t += r, t += e[o + 1];
  }), q(t);
}
function X() {
  f.clear(), T.clear();
}
function Z() {
  k = !1;
}
function ee() {
  S = !0;
}
function ne() {
  S = !1;
}
var v = {
  gql: p,
  resetCaches: X,
  disableFragmentWarnings: Z,
  enableExperimentalFragmentVariables: ee,
  disableExperimentalFragmentVariables: ne
};
(function(e) {
  e.gql = v.gql, e.resetCaches = v.resetCaches, e.disableFragmentWarnings = v.disableFragmentWarnings, e.enableExperimentalFragmentVariables = v.enableExperimentalFragmentVariables, e.disableExperimentalFragmentVariables = v.disableExperimentalFragmentVariables;
})(p || (p = {}));
p.default = p;
const ie = 80;
let A = {};
function te(e) {
  return `
# ` + e.replace(/\n/g, `
# `);
}
function a(e, n) {
  return e ? e.filter((i) => i).join(n || "") : "";
}
function N(e) {
  return e?.some((n) => n.includes(`
`)) ?? !1;
}
function ae(e) {
  return (n, i, t, r, o) => {
    const l = [], O = r.reduce((h, I) => (["fields", "arguments", "values"].includes(I) && h.name && l.push(h.name.value), h[I]), o[0]), E = [...l, O?.name?.value].filter(Boolean).join("."), D = [];
    return n.kind.includes("Definition") && A[E] && D.push(...A[E]), a([...D.map(te), n.description, e(n, i, t, r, o)], `
`);
  };
}
function m(e) {
  return e && `  ${e.replace(/\n/g, `
  `)}`;
}
function c(e) {
  return e && e.length !== 0 ? `{
${m(a(e, `
`))}
}` : "";
}
function s(e, n, i) {
  return n ? e + n + (i || "") : "";
}
function re(e, n = !1) {
  const i = e.replace(/"""/g, '\\"""');
  return (e[0] === " " || e[0] === "	") && e.indexOf(`
`) === -1 ? `"""${i.replace(/"$/, `"
`)}"""` : `"""
${n ? i : m(i)}
"""`;
}
const V = {
  Name: { leave: (e) => e.value },
  Variable: { leave: (e) => "$" + e.name },
  // Document
  Document: {
    leave: (e) => a(e.definitions, `

`)
  },
  OperationDefinition: {
    leave: (e) => {
      const n = s("(", a(e.variableDefinitions, ", "), ")");
      return a([e.operation, a([e.name, n]), a(e.directives, " ")], " ") + " " + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: n, defaultValue: i, directives: t }) => e + ": " + n + s(" = ", i) + s(" ", a(t, " "))
  },
  SelectionSet: { leave: ({ selections: e }) => c(e) },
  Field: {
    leave({ alias: e, name: n, arguments: i, directives: t, selectionSet: r }) {
      const o = s("", e, ": ") + n;
      let l = o + s("(", a(i, ", "), ")");
      return l.length > ie && (l = o + s(`(
`, m(a(i, `
`)), `
)`)), a([l, a(t, " "), r], " ");
    }
  },
  Argument: { leave: ({ name: e, value: n }) => e + ": " + n },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: n }) => "..." + e + s(" ", a(n, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: n, selectionSet: i }) => a(["...", s("on ", e), a(n, " "), i], " ")
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: n, variableDefinitions: i, directives: t, selectionSet: r }) => (
      // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      `fragment ${e}${s("(", a(i, ", "), ")")} on ${n} ${s("", a(t, " "), " ")}` + r
    )
  },
  // Value
  IntValue: { leave: ({ value: e }) => e },
  FloatValue: { leave: ({ value: e }) => e },
  StringValue: {
    leave: ({ value: e, block: n }) => n ? re(e) : JSON.stringify(e)
  },
  BooleanValue: { leave: ({ value: e }) => e ? "true" : "false" },
  NullValue: { leave: () => "null" },
  EnumValue: { leave: ({ value: e }) => e },
  ListValue: { leave: ({ values: e }) => "[" + a(e, ", ") + "]" },
  ObjectValue: { leave: ({ fields: e }) => "{" + a(e, ", ") + "}" },
  ObjectField: { leave: ({ name: e, value: n }) => e + ": " + n },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: n }) => "@" + e + s("(", a(n, ", "), ")")
  },
  // Type
  NamedType: { leave: ({ name: e }) => e },
  ListType: { leave: ({ type: e }) => "[" + e + "]" },
  NonNullType: { leave: ({ type: e }) => e + "!" },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ directives: e, operationTypes: n }) => a(["schema", a(e, " "), c(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: n }) => e + ": " + n
  },
  ScalarTypeDefinition: {
    leave: ({ name: e, directives: n }) => a(["scalar", e, a(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ name: e, interfaces: n, directives: i, fields: t }) => a([
      "type",
      e,
      s("implements ", a(n, " & ")),
      a(i, " "),
      c(t)
    ], " ")
  },
  FieldDefinition: {
    leave: ({ name: e, arguments: n, type: i, directives: t }) => e + (N(n) ? s(`(
`, m(a(n, `
`)), `
)`) : s("(", a(n, ", "), ")")) + ": " + i + s(" ", a(t, " "))
  },
  InputValueDefinition: {
    leave: ({ name: e, type: n, defaultValue: i, directives: t }) => a([e + ": " + n, s("= ", i), a(t, " ")], " ")
  },
  InterfaceTypeDefinition: {
    leave: ({ name: e, interfaces: n, directives: i, fields: t }) => a([
      "interface",
      e,
      s("implements ", a(n, " & ")),
      a(i, " "),
      c(t)
    ], " ")
  },
  UnionTypeDefinition: {
    leave: ({ name: e, directives: n, types: i }) => a(["union", e, a(n, " "), s("= ", a(i, " | "))], " ")
  },
  EnumTypeDefinition: {
    leave: ({ name: e, directives: n, values: i }) => a(["enum", e, a(n, " "), c(i)], " ")
  },
  EnumValueDefinition: {
    leave: ({ name: e, directives: n }) => a([e, a(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ name: e, directives: n, fields: i }) => a(["input", e, a(n, " "), c(i)], " ")
  },
  DirectiveDefinition: {
    leave: ({ name: e, arguments: n, repeatable: i, locations: t }) => "directive @" + e + (N(n) ? s(`(
`, m(a(n, `
`)), `
)`) : s("(", a(n, ", "), ")")) + (i ? " repeatable" : "") + " on " + a(t, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: n }) => a(["extend schema", a(e, " "), c(n)], " ")
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: n }) => a(["extend scalar", e, a(n, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: n, directives: i, fields: t }) => a([
      "extend type",
      e,
      s("implements ", a(n, " & ")),
      a(i, " "),
      c(t)
    ], " ")
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: n, directives: i, fields: t }) => a([
      "extend interface",
      e,
      s("implements ", a(n, " & ")),
      a(i, " "),
      c(t)
    ], " ")
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: n, types: i }) => a(["extend union", e, a(n, " "), s("= ", a(i, " | "))], " ")
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: n, values: i }) => a(["extend enum", e, a(n, " "), c(i)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: n, fields: i }) => a(["extend input", e, a(n, " "), c(i)], " ")
  }
};
Object.keys(V).reduce((e, n) => ({
  ...e,
  [n]: {
    leave: ae(V[n].leave)
  }
}), {});
var w;
(function(e) {
  e[e.A_SMALLER_THAN_B = -1] = "A_SMALLER_THAN_B", e[e.A_EQUALS_B = 0] = "A_EQUALS_B", e[e.A_GREATER_THAN_B = 1] = "A_GREATER_THAN_B";
})(w || (w = {}));
var d = {};
Object.defineProperty(d, "__esModule", {
  value: !0
});
d.Token = d.QueryDocumentKeys = d.OperationTypeNode = d.Location = void 0;
d.isNode = ce;
class oe {
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The Token at which this Node begins.
   */
  /**
   * The Token at which this Node ends.
   */
  /**
   * The Source document the AST represents.
   */
  constructor(n, i, t) {
    this.start = n.start, this.end = i.end, this.startToken = n, this.endToken = i, this.source = t;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
}
d.Location = oe;
class se {
  /**
   * The kind of Token.
   */
  /**
   * The character offset at which this Node begins.
   */
  /**
   * The character offset at which this Node ends.
   */
  /**
   * The 1-indexed line number on which this Token appears.
   */
  /**
   * The 1-indexed column number at which this Token begins.
   */
  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   *
   * Note: is undefined for punctuation tokens, but typed as string for
   * convenience in the parser.
   */
  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  constructor(n, i, t, r, o, l) {
    this.kind = n, this.start = i, this.end = t, this.line = r, this.column = o, this.value = l, this.prev = null, this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
}
d.Token = se;
const B = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    // Note: fragment variable definitions are deprecated and will removed in v17.0.0
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};
d.QueryDocumentKeys = B;
const le = new Set(Object.keys(B));
function ce(e) {
  const n = e?.kind;
  return typeof n == "string" && le.has(n);
}
var b;
d.OperationTypeNode = b;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(b || (d.OperationTypeNode = b = {}));
p`
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
const Oe = p`
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
`, de = () => z.unsafe`
    CREATE TABLE IF NOT EXISTS ${z.identifier([x])} (
      "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      "billing_address" VARCHAR(255),
      "name" VARCHAR(255),
      "schema" VARCHAR(63) DEFAULT 'public',
      "tax_id" VARCHAR(255),
      "tenant" BOOLEAN,
      "type_id" INTEGER
    );
  `, ue = async (e) => {
  await e.connect(async (n) => {
    await n.query(de());
  });
}, he = F(
  async (e, n, i) => {
    const { log: t, slonik: r } = e;
    t.info("Registering billing-fastify plugin"), await ue(r), i();
  }
);
export {
  he as default,
  Se as organizationResolver,
  ye as organizationRoutes,
  Oe as organizationSchema,
  u as organizationService
};
