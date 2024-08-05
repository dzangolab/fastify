import Ue from "fastify-plugin";
import g from "mercurius";
import Sn from "mercurius-auth";
import ve, { EmailVerificationClaim as ws } from "supertokens-node/recipe/emailverification";
import Ke, { Error as At, createNewSession as Le } from "supertokens-node/recipe/session";
import { FastifyRequest as _s } from "supertokens-node/lib/build/framework/fastify/framework";
import On, { getRequestFromUserContext as Mt, deleteUser as bt } from "supertokens-node";
import { SessionClaim as Rs } from "supertokens-node/lib/build/recipe/session/claims";
import R from "supertokens-node/recipe/userroles";
import As from "@fastify/cors";
import bs from "@fastify/formbody";
import { errorHandler as ks, plugin as Ds, wrapResponse as xs } from "supertokens-node/framework/fastify";
import { verifySession as Ls } from "supertokens-node/recipe/session/framework/fastify";
import "@dzangolab/fastify-mailer";
import { DefaultSqlFactory as wn, createTableIdentifier as _n, createFilterFragment as Rn, createLimitFragment as An, BaseService as bn, formatDate as de, createTableFragment as Cs, createSortFragment as Us } from "@dzangolab/fastify-slonik";
import { formatDate as su } from "@dzangolab/fastify-slonik";
import ke, { getUserById as Ps, getUserByThirdPartyInfo as Fs, emailPasswordSignUp as ft } from "supertokens-node/recipe/thirdpartyemailpassword";
import $t from "humps";
import { sql as A } from "slonik";
import kn from "validator";
import { z as Dn } from "zod";
function w(e, t) {
  if (!!!e)
    throw new Error(t);
}
function ge(e) {
  return typeof e == "object" && e !== null;
}
function Bt(e, t) {
  if (!!!e)
    throw new Error(
      t ?? "Unexpected invariant triggered."
    );
}
const Vs = /\r\n|[\n\r]/g;
function kt(e, t) {
  let n = 0, s = 1;
  for (const i of e.body.matchAll(Vs)) {
    if (typeof i.index == "number" || Bt(!1), i.index >= t)
      break;
    n = i.index + i[0].length, s += 1;
  }
  return {
    line: s,
    column: t + 1 - n
  };
}
function Ms(e) {
  return xn(
    e.source,
    kt(e.source, e.start)
  );
}
function xn(e, t) {
  const n = e.locationOffset.column - 1, s = "".padStart(n) + e.body, i = t.line - 1, r = e.locationOffset.line - 1, o = t.line + r, a = t.line === 1 ? n : 0, u = t.column + a, l = `${e.name}:${o}:${u}
`, d = s.split(/\r\n|[\n\r]/g), f = d[i];
  if (f.length > 120) {
    const E = Math.floor(u / 80), y = u % 80, v = [];
    for (let I = 0; I < f.length; I += 80)
      v.push(f.slice(I, I + 80));
    return l + en([
      [`${o} |`, v[0]],
      ...v.slice(1, E + 1).map((I) => ["|", I]),
      ["|", "^".padStart(y)],
      ["|", v[E + 1]]
    ]);
  }
  return l + en([
    // Lines specified like this: ["prefix", "string"],
    [`${o - 1} |`, d[i - 1]],
    [`${o} |`, f],
    ["|", "^".padStart(u)],
    [`${o + 1} |`, d[i + 1]]
  ]);
}
function en(e) {
  const t = e.filter(([s, i]) => i !== void 0), n = Math.max(...t.map(([s]) => s.length));
  return t.map(([s, i]) => s.padStart(n) + (i ? " " + i : "")).join(`
`);
}
function $s(e) {
  const t = e[0];
  return t == null || "kind" in t || "length" in t ? {
    nodes: t,
    source: e[1],
    positions: e[2],
    path: e[3],
    originalError: e[4],
    extensions: e[5]
  } : t;
}
class O extends Error {
  /**
   * An array of `{ line, column }` locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */
  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */
  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */
  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */
  /**
   * The original error thrown from a field resolver during execution.
   */
  /**
   * Extension fields to add to the formatted error.
   */
  /**
   * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
   */
  constructor(t, ...n) {
    var s, i, r;
    const { nodes: o, source: a, positions: u, path: l, originalError: d, extensions: f } = $s(n);
    super(t), this.name = "GraphQLError", this.path = l ?? void 0, this.originalError = d ?? void 0, this.nodes = tn(
      Array.isArray(o) ? o : o ? [o] : void 0
    );
    const E = tn(
      (s = this.nodes) === null || s === void 0 ? void 0 : s.map((v) => v.loc).filter((v) => v != null)
    );
    this.source = a ?? (E == null || (i = E[0]) === null || i === void 0 ? void 0 : i.source), this.positions = u ?? E?.map((v) => v.start), this.locations = u && a ? u.map((v) => kt(a, v)) : E?.map((v) => kt(v.source, v.start));
    const y = ge(
      d?.extensions
    ) ? d?.extensions : void 0;
    this.extensions = (r = f ?? y) !== null && r !== void 0 ? r : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
      message: {
        writable: !0,
        enumerable: !0
      },
      name: {
        enumerable: !1
      },
      nodes: {
        enumerable: !1
      },
      source: {
        enumerable: !1
      },
      positions: {
        enumerable: !1
      },
      originalError: {
        enumerable: !1
      }
    }), d != null && d.stack ? Object.defineProperty(this, "stack", {
      value: d.stack,
      writable: !0,
      configurable: !0
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, O) : Object.defineProperty(this, "stack", {
      value: Error().stack,
      writable: !0,
      configurable: !0
    });
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let t = this.message;
    if (this.nodes)
      for (const n of this.nodes)
        n.loc && (t += `

` + Ms(n.loc));
    else if (this.source && this.locations)
      for (const n of this.locations)
        t += `

` + xn(this.source, n);
    return t;
  }
  toJSON() {
    const t = {
      message: this.message
    };
    return this.locations != null && (t.locations = this.locations), this.path != null && (t.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (t.extensions = this.extensions), t;
  }
}
function tn(e) {
  return e === void 0 || e.length === 0 ? void 0 : e;
}
function F(e, t, n) {
  return new O(`Syntax Error: ${n}`, {
    source: e,
    positions: [t]
  });
}
class Bs {
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
  constructor(t, n, s) {
    this.start = t.start, this.end = n.end, this.startToken = t, this.endToken = n, this.source = s;
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
class Ln {
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
  constructor(t, n, s, i, r, o) {
    this.kind = t, this.start = n, this.end = s, this.line = i, this.column = r, this.value = o, this.prev = null, this.next = null;
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
const Cn = {
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
}, js = new Set(Object.keys(Cn));
function nn(e) {
  const t = e?.kind;
  return typeof t == "string" && js.has(t);
}
var re;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(re || (re = {}));
var N;
(function(e) {
  e.QUERY = "QUERY", e.MUTATION = "MUTATION", e.SUBSCRIPTION = "SUBSCRIPTION", e.FIELD = "FIELD", e.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", e.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", e.INLINE_FRAGMENT = "INLINE_FRAGMENT", e.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", e.SCHEMA = "SCHEMA", e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.FIELD_DEFINITION = "FIELD_DEFINITION", e.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.ENUM_VALUE = "ENUM_VALUE", e.INPUT_OBJECT = "INPUT_OBJECT", e.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(N || (N = {}));
var c;
(function(e) {
  e.NAME = "Name", e.DOCUMENT = "Document", e.OPERATION_DEFINITION = "OperationDefinition", e.VARIABLE_DEFINITION = "VariableDefinition", e.SELECTION_SET = "SelectionSet", e.FIELD = "Field", e.ARGUMENT = "Argument", e.FRAGMENT_SPREAD = "FragmentSpread", e.INLINE_FRAGMENT = "InlineFragment", e.FRAGMENT_DEFINITION = "FragmentDefinition", e.VARIABLE = "Variable", e.INT = "IntValue", e.FLOAT = "FloatValue", e.STRING = "StringValue", e.BOOLEAN = "BooleanValue", e.NULL = "NullValue", e.ENUM = "EnumValue", e.LIST = "ListValue", e.OBJECT = "ObjectValue", e.OBJECT_FIELD = "ObjectField", e.DIRECTIVE = "Directive", e.NAMED_TYPE = "NamedType", e.LIST_TYPE = "ListType", e.NON_NULL_TYPE = "NonNullType", e.SCHEMA_DEFINITION = "SchemaDefinition", e.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", e.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", e.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", e.FIELD_DEFINITION = "FieldDefinition", e.INPUT_VALUE_DEFINITION = "InputValueDefinition", e.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", e.UNION_TYPE_DEFINITION = "UnionTypeDefinition", e.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", e.ENUM_VALUE_DEFINITION = "EnumValueDefinition", e.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", e.DIRECTIVE_DEFINITION = "DirectiveDefinition", e.SCHEMA_EXTENSION = "SchemaExtension", e.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", e.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", e.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", e.UNION_TYPE_EXTENSION = "UnionTypeExtension", e.ENUM_TYPE_EXTENSION = "EnumTypeExtension", e.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(c || (c = {}));
function Dt(e) {
  return e === 9 || e === 32;
}
function ze(e) {
  return e >= 48 && e <= 57;
}
function Un(e) {
  return e >= 97 && e <= 122 || // A-Z
  e >= 65 && e <= 90;
}
function jt(e) {
  return Un(e) || e === 95;
}
function Pn(e) {
  return Un(e) || ze(e) || e === 95;
}
function Gs(e) {
  var t;
  let n = Number.MAX_SAFE_INTEGER, s = null, i = -1;
  for (let o = 0; o < e.length; ++o) {
    var r;
    const a = e[o], u = Js(a);
    u !== a.length && (s = (r = s) !== null && r !== void 0 ? r : o, i = o, o !== 0 && u < n && (n = u));
  }
  return e.map((o, a) => a === 0 ? o : o.slice(n)).slice(
    (t = s) !== null && t !== void 0 ? t : 0,
    i + 1
  );
}
function Js(e) {
  let t = 0;
  for (; t < e.length && Dt(e.charCodeAt(t)); )
    ++t;
  return t;
}
function Ys(e, t) {
  const n = e.replace(/"""/g, '\\"""'), s = n.split(/\r\n|[\n\r]/g), i = s.length === 1, r = s.length > 1 && s.slice(1).every((y) => y.length === 0 || Dt(y.charCodeAt(0))), o = n.endsWith('\\"""'), a = e.endsWith('"') && !o, u = e.endsWith("\\"), l = a || u, d = !(t != null && t.minimize) && // add leading and trailing new lines only if it improves readability
  (!i || e.length > 70 || l || r || o);
  let f = "";
  const E = i && Dt(e.charCodeAt(0));
  return (d && !E || r) && (f += `
`), f += n, (d || l) && (f += `
`), '"""' + f + '"""';
}
var p;
(function(e) {
  e.SOF = "<SOF>", e.EOF = "<EOF>", e.BANG = "!", e.DOLLAR = "$", e.AMP = "&", e.PAREN_L = "(", e.PAREN_R = ")", e.SPREAD = "...", e.COLON = ":", e.EQUALS = "=", e.AT = "@", e.BRACKET_L = "[", e.BRACKET_R = "]", e.BRACE_L = "{", e.PIPE = "|", e.BRACE_R = "}", e.NAME = "Name", e.INT = "Int", e.FLOAT = "Float", e.STRING = "String", e.BLOCK_STRING = "BlockString", e.COMMENT = "Comment";
})(p || (p = {}));
class Qs {
  /**
   * The previously focused non-ignored token.
   */
  /**
   * The currently focused non-ignored token.
   */
  /**
   * The (1-indexed) line containing the current token.
   */
  /**
   * The character offset at which the current line begins.
   */
  constructor(t) {
    const n = new Ln(p.SOF, 0, 0, 0, 0);
    this.source = t, this.lastToken = n, this.token = n, this.line = 1, this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */
  advance() {
    return this.lastToken = this.token, this.token = this.lookahead();
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  lookahead() {
    let t = this.token;
    if (t.kind !== p.EOF)
      do
        if (t.next)
          t = t.next;
        else {
          const n = Ws(this, t.end);
          t.next = n, n.prev = t, t = n;
        }
      while (t.kind === p.COMMENT);
    return t;
  }
}
function Hs(e) {
  return e === p.BANG || e === p.DOLLAR || e === p.AMP || e === p.PAREN_L || e === p.PAREN_R || e === p.SPREAD || e === p.COLON || e === p.EQUALS || e === p.AT || e === p.BRACKET_L || e === p.BRACKET_R || e === p.BRACE_L || e === p.PIPE || e === p.BRACE_R;
}
function Pe(e) {
  return e >= 0 && e <= 55295 || e >= 57344 && e <= 1114111;
}
function ht(e, t) {
  return Fn(e.charCodeAt(t)) && Vn(e.charCodeAt(t + 1));
}
function Fn(e) {
  return e >= 55296 && e <= 56319;
}
function Vn(e) {
  return e >= 56320 && e <= 57343;
}
function ye(e, t) {
  const n = e.source.body.codePointAt(t);
  if (n === void 0)
    return p.EOF;
  if (n >= 32 && n <= 126) {
    const s = String.fromCodePoint(n);
    return s === '"' ? `'"'` : `"${s}"`;
  }
  return "U+" + n.toString(16).toUpperCase().padStart(4, "0");
}
function C(e, t, n, s, i) {
  const r = e.line, o = 1 + n - e.lineStart;
  return new Ln(t, n, s, r, o, i);
}
function Ws(e, t) {
  const n = e.source.body, s = n.length;
  let i = t;
  for (; i < s; ) {
    const r = n.charCodeAt(i);
    switch (r) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++i;
        continue;
      case 10:
        ++i, ++e.line, e.lineStart = i;
        continue;
      case 13:
        n.charCodeAt(i + 1) === 10 ? i += 2 : ++i, ++e.line, e.lineStart = i;
        continue;
      case 35:
        return qs(e, i);
      case 33:
        return C(e, p.BANG, i, i + 1);
      case 36:
        return C(e, p.DOLLAR, i, i + 1);
      case 38:
        return C(e, p.AMP, i, i + 1);
      case 40:
        return C(e, p.PAREN_L, i, i + 1);
      case 41:
        return C(e, p.PAREN_R, i, i + 1);
      case 46:
        if (n.charCodeAt(i + 1) === 46 && n.charCodeAt(i + 2) === 46)
          return C(e, p.SPREAD, i, i + 3);
        break;
      case 58:
        return C(e, p.COLON, i, i + 1);
      case 61:
        return C(e, p.EQUALS, i, i + 1);
      case 64:
        return C(e, p.AT, i, i + 1);
      case 91:
        return C(e, p.BRACKET_L, i, i + 1);
      case 93:
        return C(e, p.BRACKET_R, i, i + 1);
      case 123:
        return C(e, p.BRACE_L, i, i + 1);
      case 124:
        return C(e, p.PIPE, i, i + 1);
      case 125:
        return C(e, p.BRACE_R, i, i + 1);
      case 34:
        return n.charCodeAt(i + 1) === 34 && n.charCodeAt(i + 2) === 34 ? ti(e, i) : zs(e, i);
    }
    if (ze(r) || r === 45)
      return Ks(e, i, r);
    if (jt(r))
      return ni(e, i);
    throw F(
      e.source,
      i,
      r === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : Pe(r) || ht(n, i) ? `Unexpected character: ${ye(e, i)}.` : `Invalid character: ${ye(e, i)}.`
    );
  }
  return C(e, p.EOF, s, s);
}
function qs(e, t) {
  const n = e.source.body, s = n.length;
  let i = t + 1;
  for (; i < s; ) {
    const r = n.charCodeAt(i);
    if (r === 10 || r === 13)
      break;
    if (Pe(r))
      ++i;
    else if (ht(n, i))
      i += 2;
    else
      break;
  }
  return C(
    e,
    p.COMMENT,
    t,
    i,
    n.slice(t + 1, i)
  );
}
function Ks(e, t, n) {
  const s = e.source.body;
  let i = t, r = n, o = !1;
  if (r === 45 && (r = s.charCodeAt(++i)), r === 48) {
    if (r = s.charCodeAt(++i), ze(r))
      throw F(
        e.source,
        i,
        `Invalid number, unexpected digit after 0: ${ye(
          e,
          i
        )}.`
      );
  } else
    i = St(e, i, r), r = s.charCodeAt(i);
  if (r === 46 && (o = !0, r = s.charCodeAt(++i), i = St(e, i, r), r = s.charCodeAt(i)), (r === 69 || r === 101) && (o = !0, r = s.charCodeAt(++i), (r === 43 || r === 45) && (r = s.charCodeAt(++i)), i = St(e, i, r), r = s.charCodeAt(i)), r === 46 || jt(r))
    throw F(
      e.source,
      i,
      `Invalid number, expected digit but got: ${ye(
        e,
        i
      )}.`
    );
  return C(
    e,
    o ? p.FLOAT : p.INT,
    t,
    i,
    s.slice(t, i)
  );
}
function St(e, t, n) {
  if (!ze(n))
    throw F(
      e.source,
      t,
      `Invalid number, expected digit but got: ${ye(
        e,
        t
      )}.`
    );
  const s = e.source.body;
  let i = t + 1;
  for (; ze(s.charCodeAt(i)); )
    ++i;
  return i;
}
function zs(e, t) {
  const n = e.source.body, s = n.length;
  let i = t + 1, r = i, o = "";
  for (; i < s; ) {
    const a = n.charCodeAt(i);
    if (a === 34)
      return o += n.slice(r, i), C(e, p.STRING, t, i + 1, o);
    if (a === 92) {
      o += n.slice(r, i);
      const u = n.charCodeAt(i + 1) === 117 ? n.charCodeAt(i + 2) === 123 ? Xs(e, i) : Zs(e, i) : ei(e, i);
      o += u.value, i += u.size, r = i;
      continue;
    }
    if (a === 10 || a === 13)
      break;
    if (Pe(a))
      ++i;
    else if (ht(n, i))
      i += 2;
    else
      throw F(
        e.source,
        i,
        `Invalid character within String: ${ye(
          e,
          i
        )}.`
      );
  }
  throw F(e.source, i, "Unterminated string.");
}
function Xs(e, t) {
  const n = e.source.body;
  let s = 0, i = 3;
  for (; i < 12; ) {
    const r = n.charCodeAt(t + i++);
    if (r === 125) {
      if (i < 5 || !Pe(s))
        break;
      return {
        value: String.fromCodePoint(s),
        size: i
      };
    }
    if (s = s << 4 | Ye(r), s < 0)
      break;
  }
  throw F(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(
      t,
      t + i
    )}".`
  );
}
function Zs(e, t) {
  const n = e.source.body, s = sn(n, t + 2);
  if (Pe(s))
    return {
      value: String.fromCodePoint(s),
      size: 6
    };
  if (Fn(s) && n.charCodeAt(t + 6) === 92 && n.charCodeAt(t + 7) === 117) {
    const i = sn(n, t + 8);
    if (Vn(i))
      return {
        value: String.fromCodePoint(s, i),
        size: 12
      };
  }
  throw F(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(t, t + 6)}".`
  );
}
function sn(e, t) {
  return Ye(e.charCodeAt(t)) << 12 | Ye(e.charCodeAt(t + 1)) << 8 | Ye(e.charCodeAt(t + 2)) << 4 | Ye(e.charCodeAt(t + 3));
}
function Ye(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 55 : e >= 97 && e <= 102 ? e - 87 : -1;
}
function ei(e, t) {
  const n = e.source.body;
  switch (n.charCodeAt(t + 1)) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: `
`,
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw F(
    e.source,
    t,
    `Invalid character escape sequence: "${n.slice(
      t,
      t + 2
    )}".`
  );
}
function ti(e, t) {
  const n = e.source.body, s = n.length;
  let i = e.lineStart, r = t + 3, o = r, a = "";
  const u = [];
  for (; r < s; ) {
    const l = n.charCodeAt(r);
    if (l === 34 && n.charCodeAt(r + 1) === 34 && n.charCodeAt(r + 2) === 34) {
      a += n.slice(o, r), u.push(a);
      const d = C(
        e,
        p.BLOCK_STRING,
        t,
        r + 3,
        // Return a string of the lines joined with U+000A.
        Gs(u).join(`
`)
      );
      return e.line += u.length - 1, e.lineStart = i, d;
    }
    if (l === 92 && n.charCodeAt(r + 1) === 34 && n.charCodeAt(r + 2) === 34 && n.charCodeAt(r + 3) === 34) {
      a += n.slice(o, r), o = r + 1, r += 4;
      continue;
    }
    if (l === 10 || l === 13) {
      a += n.slice(o, r), u.push(a), l === 13 && n.charCodeAt(r + 1) === 10 ? r += 2 : ++r, a = "", o = r, i = r;
      continue;
    }
    if (Pe(l))
      ++r;
    else if (ht(n, r))
      r += 2;
    else
      throw F(
        e.source,
        r,
        `Invalid character within String: ${ye(
          e,
          r
        )}.`
      );
  }
  throw F(e.source, r, "Unterminated string.");
}
function ni(e, t) {
  const n = e.source.body, s = n.length;
  let i = t + 1;
  for (; i < s; ) {
    const r = n.charCodeAt(i);
    if (Pn(r))
      ++i;
    else
      break;
  }
  return C(
    e,
    p.NAME,
    t,
    i,
    n.slice(t, i)
  );
}
const si = 10, Mn = 2;
function _(e) {
  return mt(e, []);
}
function mt(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return ii(e, t);
    default:
      return String(e);
  }
}
function ii(e, t) {
  if (e === null)
    return "null";
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (ri(e)) {
    const s = e.toJSON();
    if (s !== e)
      return typeof s == "string" ? s : mt(s, n);
  } else if (Array.isArray(e))
    return ai(e, n);
  return oi(e, n);
}
function ri(e) {
  return typeof e.toJSON == "function";
}
function oi(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > Mn ? "[" + ci(e) + "]" : "{ " + n.map(
    ([i, r]) => i + ": " + mt(r, t)
  ).join(", ") + " }";
}
function ai(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > Mn)
    return "[Array]";
  const n = Math.min(si, e.length), s = e.length - n, i = [];
  for (let r = 0; r < n; ++r)
    i.push(mt(e[r], t));
  return s === 1 ? i.push("... 1 more item") : s > 1 && i.push(`... ${s} more items`), "[" + i.join(", ") + "]";
}
function ci(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
const ui = globalThis.process && // eslint-disable-next-line no-undef
process.env.NODE_ENV === "production", X = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  ui ? function(t, n) {
    return t instanceof n;
  } : function(t, n) {
    if (t instanceof n)
      return !0;
    if (typeof t == "object" && t !== null) {
      var s;
      const i = n.prototype[Symbol.toStringTag], r = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in t ? t[Symbol.toStringTag] : (s = t.constructor) === null || s === void 0 ? void 0 : s.name
      );
      if (i === r) {
        const o = _(t);
        throw new Error(`Cannot use ${i} "${o}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
      }
    }
    return !1;
  }
);
class Gt {
  constructor(t, n = "GraphQL request", s = {
    line: 1,
    column: 1
  }) {
    typeof t == "string" || w(!1, `Body must be a string. Received: ${_(t)}.`), this.body = t, this.name = n, this.locationOffset = s, this.locationOffset.line > 0 || w(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || w(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function li(e) {
  return X(e, Gt);
}
function $n(e, t) {
  return new di(e, t).parseDocument();
}
class di {
  constructor(t, n = {}) {
    const s = li(t) ? t : new Gt(t);
    this._lexer = new Qs(s), this._options = n, this._tokenCounter = 0;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const t = this.expectToken(p.NAME);
    return this.node(t, {
      kind: c.NAME,
      value: t.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: c.DOCUMENT,
      definitions: this.many(
        p.SOF,
        this.parseDefinition,
        p.EOF
      )
    });
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   *
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  parseDefinition() {
    if (this.peek(p.BRACE_L))
      return this.parseOperationDefinition();
    const t = this.peekDescription(), n = t ? this._lexer.lookahead() : this._lexer.token;
    if (n.kind === p.NAME) {
      switch (n.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (t)
        throw F(
          this._lexer.source,
          this._lexer.token.start,
          "Unexpected description, descriptions are supported only on type definitions."
        );
      switch (n.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(n);
  }
  // Implements the parsing rules in the Operations section.
  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  parseOperationDefinition() {
    const t = this._lexer.token;
    if (this.peek(p.BRACE_L))
      return this.node(t, {
        kind: c.OPERATION_DEFINITION,
        operation: re.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const n = this.parseOperationType();
    let s;
    return this.peek(p.NAME) && (s = this.parseName()), this.node(t, {
      kind: c.OPERATION_DEFINITION,
      operation: n,
      name: s,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */
  parseOperationType() {
    const t = this.expectToken(p.NAME);
    switch (t.value) {
      case "query":
        return re.QUERY;
      case "mutation":
        return re.MUTATION;
      case "subscription":
        return re.SUBSCRIPTION;
    }
    throw this.unexpected(t);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      p.PAREN_L,
      this.parseVariableDefinition,
      p.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: c.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(p.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(p.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const t = this._lexer.token;
    return this.expectToken(p.DOLLAR), this.node(t, {
      kind: c.VARIABLE,
      name: this.parseName()
    });
  }
  /**
   * ```
   * SelectionSet : { Selection+ }
   * ```
   */
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: c.SELECTION_SET,
      selections: this.many(
        p.BRACE_L,
        this.parseSelection,
        p.BRACE_R
      )
    });
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  parseSelection() {
    return this.peek(p.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const t = this._lexer.token, n = this.parseName();
    let s, i;
    return this.expectOptionalToken(p.COLON) ? (s = n, i = this.parseName()) : i = n, this.node(t, {
      kind: c.FIELD,
      alias: s,
      name: i,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(p.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(t) {
    const n = t ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(p.PAREN_L, n, p.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(t = !1) {
    const n = this._lexer.token, s = this.parseName();
    return this.expectToken(p.COLON), this.node(n, {
      kind: c.ARGUMENT,
      name: s,
      value: this.parseValueLiteral(t)
    });
  }
  parseConstArgument() {
    return this.parseArgument(!0);
  }
  // Implements the parsing rules in the Fragments section.
  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  parseFragment() {
    const t = this._lexer.token;
    this.expectToken(p.SPREAD);
    const n = this.expectOptionalKeyword("on");
    return !n && this.peek(p.NAME) ? this.node(t, {
      kind: c.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(t, {
      kind: c.INLINE_FRAGMENT,
      typeCondition: n ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  parseFragmentDefinition() {
    const t = this._lexer.token;
    return this.expectKeyword("fragment"), this._options.allowLegacyFragmentVariables === !0 ? this.node(t, {
      kind: c.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(t, {
      kind: c.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * FragmentName : Name but not `on`
   */
  parseFragmentName() {
    if (this._lexer.token.value === "on")
      throw this.unexpected();
    return this.parseName();
  }
  // Implements the parsing rules in the Values section.
  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseValueLiteral(t) {
    const n = this._lexer.token;
    switch (n.kind) {
      case p.BRACKET_L:
        return this.parseList(t);
      case p.BRACE_L:
        return this.parseObject(t);
      case p.INT:
        return this.advanceLexer(), this.node(n, {
          kind: c.INT,
          value: n.value
        });
      case p.FLOAT:
        return this.advanceLexer(), this.node(n, {
          kind: c.FLOAT,
          value: n.value
        });
      case p.STRING:
      case p.BLOCK_STRING:
        return this.parseStringLiteral();
      case p.NAME:
        switch (this.advanceLexer(), n.value) {
          case "true":
            return this.node(n, {
              kind: c.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(n, {
              kind: c.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(n, {
              kind: c.NULL
            });
          default:
            return this.node(n, {
              kind: c.ENUM,
              value: n.value
            });
        }
      case p.DOLLAR:
        if (t)
          if (this.expectToken(p.DOLLAR), this._lexer.token.kind === p.NAME) {
            const s = this._lexer.token.value;
            throw F(
              this._lexer.source,
              n.start,
              `Unexpected variable "$${s}" in constant value.`
            );
          } else
            throw this.unexpected(n);
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(!0);
  }
  parseStringLiteral() {
    const t = this._lexer.token;
    return this.advanceLexer(), this.node(t, {
      kind: c.STRING,
      value: t.value,
      block: t.kind === p.BLOCK_STRING
    });
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  parseList(t) {
    const n = () => this.parseValueLiteral(t);
    return this.node(this._lexer.token, {
      kind: c.LIST,
      values: this.any(p.BRACKET_L, n, p.BRACKET_R)
    });
  }
  /**
   * ```
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   * ```
   */
  parseObject(t) {
    const n = () => this.parseObjectField(t);
    return this.node(this._lexer.token, {
      kind: c.OBJECT,
      fields: this.any(p.BRACE_L, n, p.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(t) {
    const n = this._lexer.token, s = this.parseName();
    return this.expectToken(p.COLON), this.node(n, {
      kind: c.OBJECT_FIELD,
      name: s,
      value: this.parseValueLiteral(t)
    });
  }
  // Implements the parsing rules in the Directives section.
  /**
   * Directives[Const] : Directive[?Const]+
   */
  parseDirectives(t) {
    const n = [];
    for (; this.peek(p.AT); )
      n.push(this.parseDirective(t));
    return n;
  }
  parseConstDirectives() {
    return this.parseDirectives(!0);
  }
  /**
   * ```
   * Directive[Const] : @ Name Arguments[?Const]?
   * ```
   */
  parseDirective(t) {
    const n = this._lexer.token;
    return this.expectToken(p.AT), this.node(n, {
      kind: c.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(t)
    });
  }
  // Implements the parsing rules in the Types section.
  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  parseTypeReference() {
    const t = this._lexer.token;
    let n;
    if (this.expectOptionalToken(p.BRACKET_L)) {
      const s = this.parseTypeReference();
      this.expectToken(p.BRACKET_R), n = this.node(t, {
        kind: c.LIST_TYPE,
        type: s
      });
    } else
      n = this.parseNamedType();
    return this.expectOptionalToken(p.BANG) ? this.node(t, {
      kind: c.NON_NULL_TYPE,
      type: n
    }) : n;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: c.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(p.STRING) || this.peek(p.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  parseDescription() {
    if (this.peekDescription())
      return this.parseStringLiteral();
  }
  /**
   * ```
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   * ```
   */
  parseSchemaDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("schema");
    const s = this.parseConstDirectives(), i = this.many(
      p.BRACE_L,
      this.parseOperationTypeDefinition,
      p.BRACE_R
    );
    return this.node(t, {
      kind: c.SCHEMA_DEFINITION,
      description: n,
      directives: s,
      operationTypes: i
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const t = this._lexer.token, n = this.parseOperationType();
    this.expectToken(p.COLON);
    const s = this.parseNamedType();
    return this.node(t, {
      kind: c.OPERATION_TYPE_DEFINITION,
      operation: n,
      type: s
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("scalar");
    const s = this.parseName(), i = this.parseConstDirectives();
    return this.node(t, {
      kind: c.SCALAR_TYPE_DEFINITION,
      description: n,
      name: s,
      directives: i
    });
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  parseObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("type");
    const s = this.parseName(), i = this.parseImplementsInterfaces(), r = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    return this.node(t, {
      kind: c.OBJECT_TYPE_DEFINITION,
      description: n,
      name: s,
      interfaces: i,
      directives: r,
      fields: o
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(p.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      p.BRACE_L,
      this.parseFieldDefinition,
      p.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), s = this.parseName(), i = this.parseArgumentDefs();
    this.expectToken(p.COLON);
    const r = this.parseTypeReference(), o = this.parseConstDirectives();
    return this.node(t, {
      kind: c.FIELD_DEFINITION,
      description: n,
      name: s,
      arguments: i,
      type: r,
      directives: o
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      p.PAREN_L,
      this.parseInputValueDef,
      p.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const t = this._lexer.token, n = this.parseDescription(), s = this.parseName();
    this.expectToken(p.COLON);
    const i = this.parseTypeReference();
    let r;
    this.expectOptionalToken(p.EQUALS) && (r = this.parseConstValueLiteral());
    const o = this.parseConstDirectives();
    return this.node(t, {
      kind: c.INPUT_VALUE_DEFINITION,
      description: n,
      name: s,
      type: i,
      defaultValue: r,
      directives: o
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("interface");
    const s = this.parseName(), i = this.parseImplementsInterfaces(), r = this.parseConstDirectives(), o = this.parseFieldsDefinition();
    return this.node(t, {
      kind: c.INTERFACE_TYPE_DEFINITION,
      description: n,
      name: s,
      interfaces: i,
      directives: r,
      fields: o
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("union");
    const s = this.parseName(), i = this.parseConstDirectives(), r = this.parseUnionMemberTypes();
    return this.node(t, {
      kind: c.UNION_TYPE_DEFINITION,
      description: n,
      name: s,
      directives: i,
      types: r
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(p.EQUALS) ? this.delimitedMany(p.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("enum");
    const s = this.parseName(), i = this.parseConstDirectives(), r = this.parseEnumValuesDefinition();
    return this.node(t, {
      kind: c.ENUM_TYPE_DEFINITION,
      description: n,
      name: s,
      directives: i,
      values: r
    });
  }
  /**
   * ```
   * EnumValuesDefinition : { EnumValueDefinition+ }
   * ```
   */
  parseEnumValuesDefinition() {
    return this.optionalMany(
      p.BRACE_L,
      this.parseEnumValueDefinition,
      p.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), s = this.parseEnumValueName(), i = this.parseConstDirectives();
    return this.node(t, {
      kind: c.ENUM_VALUE_DEFINITION,
      description: n,
      name: s,
      directives: i
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null")
      throw F(
        this._lexer.source,
        this._lexer.token.start,
        `${tt(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    return this.parseName();
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  parseInputObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("input");
    const s = this.parseName(), i = this.parseConstDirectives(), r = this.parseInputFieldsDefinition();
    return this.node(t, {
      kind: c.INPUT_OBJECT_TYPE_DEFINITION,
      description: n,
      name: s,
      directives: i,
      fields: r
    });
  }
  /**
   * ```
   * InputFieldsDefinition : { InputValueDefinition+ }
   * ```
   */
  parseInputFieldsDefinition() {
    return this.optionalMany(
      p.BRACE_L,
      this.parseInputValueDef,
      p.BRACE_R
    );
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  parseTypeSystemExtension() {
    const t = this._lexer.lookahead();
    if (t.kind === p.NAME)
      switch (t.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    throw this.unexpected(t);
  }
  /**
   * ```
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   * ```
   */
  parseSchemaExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("schema");
    const n = this.parseConstDirectives(), s = this.optionalMany(
      p.BRACE_L,
      this.parseOperationTypeDefinition,
      p.BRACE_R
    );
    if (n.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: c.SCHEMA_EXTENSION,
      directives: n,
      operationTypes: s
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("scalar");
    const n = this.parseName(), s = this.parseConstDirectives();
    if (s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: c.SCALAR_TYPE_EXTENSION,
      name: n,
      directives: s
    });
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  parseObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("type");
    const n = this.parseName(), s = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), r = this.parseFieldsDefinition();
    if (s.length === 0 && i.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: c.OBJECT_TYPE_EXTENSION,
      name: n,
      interfaces: s,
      directives: i,
      fields: r
    });
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  parseInterfaceTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("interface");
    const n = this.parseName(), s = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), r = this.parseFieldsDefinition();
    if (s.length === 0 && i.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: c.INTERFACE_TYPE_EXTENSION,
      name: n,
      interfaces: s,
      directives: i,
      fields: r
    });
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  parseUnionTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("union");
    const n = this.parseName(), s = this.parseConstDirectives(), i = this.parseUnionMemberTypes();
    if (s.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: c.UNION_TYPE_EXTENSION,
      name: n,
      directives: s,
      types: i
    });
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  parseEnumTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("enum");
    const n = this.parseName(), s = this.parseConstDirectives(), i = this.parseEnumValuesDefinition();
    if (s.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: c.ENUM_TYPE_EXTENSION,
      name: n,
      directives: s,
      values: i
    });
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  parseInputObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("input");
    const n = this.parseName(), s = this.parseConstDirectives(), i = this.parseInputFieldsDefinition();
    if (s.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: c.INPUT_OBJECT_TYPE_EXTENSION,
      name: n,
      directives: s,
      fields: i
    });
  }
  /**
   * ```
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   * ```
   */
  parseDirectiveDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("directive"), this.expectToken(p.AT);
    const s = this.parseName(), i = this.parseArgumentDefs(), r = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const o = this.parseDirectiveLocations();
    return this.node(t, {
      kind: c.DIRECTIVE_DEFINITION,
      description: n,
      name: s,
      arguments: i,
      repeatable: r,
      locations: o
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(p.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  parseDirectiveLocation() {
    const t = this._lexer.token, n = this.parseName();
    if (Object.prototype.hasOwnProperty.call(N, n.value))
      return n;
    throw this.unexpected(t);
  }
  // Core parsing utility functions
  /**
   * Returns a node that, if configured to do so, sets a "loc" field as a
   * location object, used to identify the place in the source that created a
   * given parsed object.
   */
  node(t, n) {
    return this._options.noLocation !== !0 && (n.loc = new Bs(
      t,
      this._lexer.lastToken,
      this._lexer.source
    )), n;
  }
  /**
   * Determines if the next token is of a given kind
   */
  peek(t) {
    return this._lexer.token.kind === t;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectToken(t) {
    const n = this._lexer.token;
    if (n.kind === t)
      return this.advanceLexer(), n;
    throw F(
      this._lexer.source,
      n.start,
      `Expected ${Bn(t)}, found ${tt(n)}.`
    );
  }
  /**
   * If the next token is of the given kind, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalToken(t) {
    return this._lexer.token.kind === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  expectKeyword(t) {
    const n = this._lexer.token;
    if (n.kind === p.NAME && n.value === t)
      this.advanceLexer();
    else
      throw F(
        this._lexer.source,
        n.start,
        `Expected "${t}", found ${tt(n)}.`
      );
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(t) {
    const n = this._lexer.token;
    return n.kind === p.NAME && n.value === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(t) {
    const n = t ?? this._lexer.token;
    return F(
      this._lexer.source,
      n.start,
      `Unexpected ${tt(n)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(t, n, s) {
    this.expectToken(t);
    const i = [];
    for (; !this.expectOptionalToken(s); )
      i.push(n.call(this));
    return i;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(t, n, s) {
    if (this.expectOptionalToken(t)) {
      const i = [];
      do
        i.push(n.call(this));
      while (!this.expectOptionalToken(s));
      return i;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(t, n, s) {
    this.expectToken(t);
    const i = [];
    do
      i.push(n.call(this));
    while (!this.expectOptionalToken(s));
    return i;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(t, n) {
    this.expectOptionalToken(t);
    const s = [];
    do
      s.push(n.call(this));
    while (this.expectOptionalToken(t));
    return s;
  }
  advanceLexer() {
    const { maxTokens: t } = this._options, n = this._lexer.advance();
    if (t !== void 0 && n.kind !== p.EOF && (++this._tokenCounter, this._tokenCounter > t))
      throw F(
        this._lexer.source,
        n.start,
        `Document contains more that ${t} tokens. Parsing aborted.`
      );
  }
}
function tt(e) {
  const t = e.value;
  return Bn(e.kind) + (t != null ? ` "${t}"` : "");
}
function Bn(e) {
  return Hs(e) ? `"${e}"` : e;
}
const pi = 5;
function fi(e, t) {
  const [n, s] = t ? [e, t] : [void 0, e];
  let i = " Did you mean ";
  n && (i += n + " ");
  const r = s.map((u) => `"${u}"`);
  switch (r.length) {
    case 0:
      return "";
    case 1:
      return i + r[0] + "?";
    case 2:
      return i + r[0] + " or " + r[1] + "?";
  }
  const o = r.slice(0, pi), a = o.pop();
  return i + o.join(", ") + ", or " + a + "?";
}
function rn(e) {
  return e;
}
function hi(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const s of e)
    n[t(s)] = s;
  return n;
}
function Jt(e, t, n) {
  const s = /* @__PURE__ */ Object.create(null);
  for (const i of e)
    s[t(i)] = n(i);
  return s;
}
function Et(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const s of Object.keys(e))
    n[s] = t(e[s], s);
  return n;
}
function mi(e, t) {
  let n = 0, s = 0;
  for (; n < e.length && s < t.length; ) {
    let i = e.charCodeAt(n), r = t.charCodeAt(s);
    if (nt(i) && nt(r)) {
      let o = 0;
      do
        ++n, o = o * 10 + i - xt, i = e.charCodeAt(n);
      while (nt(i) && o > 0);
      let a = 0;
      do
        ++s, a = a * 10 + r - xt, r = t.charCodeAt(s);
      while (nt(r) && a > 0);
      if (o < a)
        return -1;
      if (o > a)
        return 1;
    } else {
      if (i < r)
        return -1;
      if (i > r)
        return 1;
      ++n, ++s;
    }
  }
  return e.length - t.length;
}
const xt = 48, Ei = 57;
function nt(e) {
  return !isNaN(e) && xt <= e && e <= Ei;
}
function vi(e, t) {
  const n = /* @__PURE__ */ Object.create(null), s = new gi(e), i = Math.floor(e.length * 0.4) + 1;
  for (const r of t) {
    const o = s.measure(r, i);
    o !== void 0 && (n[r] = o);
  }
  return Object.keys(n).sort((r, o) => {
    const a = n[r] - n[o];
    return a !== 0 ? a : mi(r, o);
  });
}
class gi {
  constructor(t) {
    this._input = t, this._inputLowerCase = t.toLowerCase(), this._inputArray = on(this._inputLowerCase), this._rows = [
      new Array(t.length + 1).fill(0),
      new Array(t.length + 1).fill(0),
      new Array(t.length + 1).fill(0)
    ];
  }
  measure(t, n) {
    if (this._input === t)
      return 0;
    const s = t.toLowerCase();
    if (this._inputLowerCase === s)
      return 1;
    let i = on(s), r = this._inputArray;
    if (i.length < r.length) {
      const d = i;
      i = r, r = d;
    }
    const o = i.length, a = r.length;
    if (o - a > n)
      return;
    const u = this._rows;
    for (let d = 0; d <= a; d++)
      u[0][d] = d;
    for (let d = 1; d <= o; d++) {
      const f = u[(d - 1) % 3], E = u[d % 3];
      let y = E[0] = d;
      for (let v = 1; v <= a; v++) {
        const I = i[d - 1] === r[v - 1] ? 0 : 1;
        let k = Math.min(
          f[v] + 1,
          // delete
          E[v - 1] + 1,
          // insert
          f[v - 1] + I
          // substitute
        );
        if (d > 1 && v > 1 && i[d - 1] === r[v - 2] && i[d - 2] === r[v - 1]) {
          const D = u[(d - 2) % 3][v - 2];
          k = Math.min(k, D + 1);
        }
        k < y && (y = k), E[v] = k;
      }
      if (y > n)
        return;
    }
    const l = u[o % 3][a];
    return l <= n ? l : void 0;
  }
}
function on(e) {
  const t = e.length, n = new Array(t);
  for (let s = 0; s < t; ++s)
    n[s] = e.charCodeAt(s);
  return n;
}
function J(e) {
  if (e == null)
    return /* @__PURE__ */ Object.create(null);
  if (Object.getPrototypeOf(e) === null)
    return e;
  const t = /* @__PURE__ */ Object.create(null);
  for (const [n, s] of Object.entries(e))
    t[n] = s;
  return t;
}
function yi(e) {
  return `"${e.replace(Ti, Ii)}"`;
}
const Ti = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function Ii(e) {
  return Ni[e.charCodeAt(0)];
}
const Ni = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
], Si = Object.freeze({});
function jn(e, t, n = Cn) {
  const s = /* @__PURE__ */ new Map();
  for (const D of Object.values(c))
    s.set(D, Oi(t, D));
  let i, r = Array.isArray(e), o = [e], a = -1, u = [], l = e, d, f;
  const E = [], y = [];
  do {
    a++;
    const D = a === o.length, _e = D && u.length !== 0;
    if (D) {
      if (d = y.length === 0 ? void 0 : E[E.length - 1], l = f, f = y.pop(), _e)
        if (r) {
          l = l.slice();
          let M = 0;
          for (const [ee, L] of u) {
            const se = ee - M;
            L === null ? (l.splice(se, 1), M++) : l[se] = L;
          }
        } else {
          l = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(l)
          );
          for (const [M, ee] of u)
            l[M] = ee;
        }
      a = i.index, o = i.keys, u = i.edits, r = i.inArray, i = i.prev;
    } else if (f) {
      if (d = r ? a : o[a], l = f[d], l == null)
        continue;
      E.push(d);
    }
    let V;
    if (!Array.isArray(l)) {
      var v, I;
      nn(l) || w(!1, `Invalid AST Node: ${_(l)}.`);
      const M = D ? (v = s.get(l.kind)) === null || v === void 0 ? void 0 : v.leave : (I = s.get(l.kind)) === null || I === void 0 ? void 0 : I.enter;
      if (V = M?.call(t, l, d, f, E, y), V === Si)
        break;
      if (V === !1) {
        if (!D) {
          E.pop();
          continue;
        }
      } else if (V !== void 0 && (u.push([d, V]), !D))
        if (nn(V))
          l = V;
        else {
          E.pop();
          continue;
        }
    }
    if (V === void 0 && _e && u.push([d, l]), D)
      E.pop();
    else {
      var k;
      i = {
        inArray: r,
        index: a,
        keys: o,
        edits: u,
        prev: i
      }, r = Array.isArray(l), o = r ? l : (k = n[l.kind]) !== null && k !== void 0 ? k : [], a = -1, u = [], f && y.push(f), f = l;
    }
  } while (i !== void 0);
  return u.length !== 0 ? u[u.length - 1][1] : e;
}
function Oi(e, t) {
  const n = e[t];
  return typeof n == "object" ? n : typeof n == "function" ? {
    enter: n,
    leave: void 0
  } : {
    enter: e.enter,
    leave: e.leave
  };
}
function pe(e) {
  return jn(e, _i);
}
const wi = 80, _i = {
  Name: {
    leave: (e) => e.value
  },
  Variable: {
    leave: (e) => "$" + e.name
  },
  // Document
  Document: {
    leave: (e) => m(e.definitions, `

`)
  },
  OperationDefinition: {
    leave(e) {
      const t = T("(", m(e.variableDefinitions, ", "), ")"), n = m(
        [
          e.operation,
          m([e.name, t]),
          m(e.directives, " ")
        ],
        " "
      );
      return (n === "query" ? "" : n + " ") + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: s }) => e + ": " + t + T(" = ", n) + T(" ", m(s, " "))
  },
  SelectionSet: {
    leave: ({ selections: e }) => Q(e)
  },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: s, selectionSet: i }) {
      const r = T("", e, ": ") + t;
      let o = r + T("(", m(n, ", "), ")");
      return o.length > wi && (o = r + T(`(
`, rt(m(n, `
`)), `
)`)), m([o, m(s, " "), i], " ");
    }
  },
  Argument: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + T(" ", m(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => m(
      [
        "...",
        T("on ", e),
        m(t, " "),
        n
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: s, selectionSet: i }) => (
      // or removed in the future.
      `fragment ${e}${T("(", m(n, ", "), ")")} on ${t} ${T("", m(s, " "), " ")}` + i
    )
  },
  // Value
  IntValue: {
    leave: ({ value: e }) => e
  },
  FloatValue: {
    leave: ({ value: e }) => e
  },
  StringValue: {
    leave: ({ value: e, block: t }) => t ? Ys(e) : yi(e)
  },
  BooleanValue: {
    leave: ({ value: e }) => e ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value: e }) => e
  },
  ListValue: {
    leave: ({ values: e }) => "[" + m(e, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: e }) => "{" + m(e, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + T("(", m(t, ", "), ")")
  },
  // Type
  NamedType: {
    leave: ({ name: e }) => e
  },
  ListType: {
    leave: ({ type: e }) => "[" + e + "]"
  },
  NonNullType: {
    leave: ({ type: e }) => e + "!"
  },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ description: e, directives: t, operationTypes: n }) => T("", e, `
`) + m(["schema", m(t, " "), Q(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ description: e, name: t, directives: n }) => T("", e, `
`) + m(["scalar", t, m(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: s, fields: i }) => T("", e, `
`) + m(
      [
        "type",
        t,
        T("implements ", m(n, " & ")),
        m(s, " "),
        Q(i)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: e, name: t, arguments: n, type: s, directives: i }) => T("", e, `
`) + t + (an(n) ? T(`(
`, rt(m(n, `
`)), `
)`) : T("(", m(n, ", "), ")")) + ": " + s + T(" ", m(i, " "))
  },
  InputValueDefinition: {
    leave: ({ description: e, name: t, type: n, defaultValue: s, directives: i }) => T("", e, `
`) + m(
      [t + ": " + n, T("= ", s), m(i, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: s, fields: i }) => T("", e, `
`) + m(
      [
        "interface",
        t,
        T("implements ", m(n, " & ")),
        m(s, " "),
        Q(i)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, types: s }) => T("", e, `
`) + m(
      ["union", t, m(n, " "), T("= ", m(s, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, values: s }) => T("", e, `
`) + m(["enum", t, m(n, " "), Q(s)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: e, name: t, directives: n }) => T("", e, `
`) + m([t, m(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, fields: s }) => T("", e, `
`) + m(["input", t, m(n, " "), Q(s)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: e, name: t, arguments: n, repeatable: s, locations: i }) => T("", e, `
`) + "directive @" + t + (an(n) ? T(`(
`, rt(m(n, `
`)), `
)`) : T("(", m(n, ", "), ")")) + (s ? " repeatable" : "") + " on " + m(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => m(
      ["extend schema", m(e, " "), Q(t)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => m(["extend scalar", e, m(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: s }) => m(
      [
        "extend type",
        e,
        T("implements ", m(t, " & ")),
        m(n, " "),
        Q(s)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: s }) => m(
      [
        "extend interface",
        e,
        T("implements ", m(t, " & ")),
        m(n, " "),
        Q(s)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => m(
      [
        "extend union",
        e,
        m(t, " "),
        T("= ", m(n, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => m(["extend enum", e, m(t, " "), Q(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => m(["extend input", e, m(t, " "), Q(n)], " ")
  }
};
function m(e, t = "") {
  var n;
  return (n = e?.filter((s) => s).join(t)) !== null && n !== void 0 ? n : "";
}
function Q(e) {
  return T(`{
`, rt(m(e, `
`)), `
}`);
}
function T(e, t, n = "") {
  return t != null && t !== "" ? e + t + n : "";
}
function rt(e) {
  return T("  ", e.replace(/\n/g, `
  `));
}
function an(e) {
  var t;
  return (t = e?.some((n) => n.includes(`
`))) !== null && t !== void 0 ? t : !1;
}
function Lt(e, t) {
  switch (e.kind) {
    case c.NULL:
      return null;
    case c.INT:
      return parseInt(e.value, 10);
    case c.FLOAT:
      return parseFloat(e.value);
    case c.STRING:
    case c.ENUM:
    case c.BOOLEAN:
      return e.value;
    case c.LIST:
      return e.values.map(
        (n) => Lt(n, t)
      );
    case c.OBJECT:
      return Jt(
        e.fields,
        (n) => n.name.value,
        (n) => Lt(n.value, t)
      );
    case c.VARIABLE:
      return t?.[e.name.value];
  }
}
function Z(e) {
  if (e != null || w(!1, "Must provide name."), typeof e == "string" || w(!1, "Expected name to be a string."), e.length === 0)
    throw new O("Expected name to be a non-empty string.");
  for (let t = 1; t < e.length; ++t)
    if (!Pn(e.charCodeAt(t)))
      throw new O(
        `Names must only contain [_a-zA-Z0-9] but "${e}" does not.`
      );
  if (!jt(e.charCodeAt(0)))
    throw new O(
      `Names must start with [_a-zA-Z] but "${e}" does not.`
    );
  return e;
}
function Ri(e) {
  if (e === "true" || e === "false" || e === "null")
    throw new O(`Enum values cannot be named: ${e}`);
  return Z(e);
}
function Gn(e) {
  return vt(e) || Ee(e) || te(e) || Te(e) || Ie(e) || le(e) || Fe(e) || Oe(e);
}
function vt(e) {
  return X(e, Ve);
}
function Ee(e) {
  return X(e, we);
}
function te(e) {
  return X(e, xi);
}
function Te(e) {
  return X(e, Li);
}
function Ie(e) {
  return X(e, Yt);
}
function le(e) {
  return X(e, Ui);
}
function Fe(e) {
  return X(e, q);
}
function Oe(e) {
  return X(e, S);
}
function Jn(e) {
  return vt(e) || Ie(e);
}
function Ai(e) {
  return te(e) || Te(e);
}
class q {
  constructor(t) {
    Gn(t) || w(!1, `Expected ${_(t)} to be a GraphQL type.`), this.ofType = t;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLList";
  }
  toString() {
    return "[" + String(this.ofType) + "]";
  }
  toJSON() {
    return this.toString();
  }
}
class S {
  constructor(t) {
    ki(t) || w(
      !1,
      `Expected ${_(t)} to be a GraphQL nullable type.`
    ), this.ofType = t;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLNonNull";
  }
  toString() {
    return String(this.ofType) + "!";
  }
  toJSON() {
    return this.toString();
  }
}
function bi(e) {
  return Fe(e) || Oe(e);
}
function ki(e) {
  return Gn(e) && !Oe(e);
}
function Di(e) {
  if (e) {
    let t = e;
    for (; bi(t); )
      t = t.ofType;
    return t;
  }
}
function Yn(e) {
  return typeof e == "function" ? e() : e;
}
function Qn(e) {
  return typeof e == "function" ? e() : e;
}
class Ve {
  constructor(t) {
    var n, s, i, r;
    const o = (n = t.parseValue) !== null && n !== void 0 ? n : rn;
    this.name = Z(t.name), this.description = t.description, this.specifiedByURL = t.specifiedByURL, this.serialize = (s = t.serialize) !== null && s !== void 0 ? s : rn, this.parseValue = o, this.parseLiteral = (i = t.parseLiteral) !== null && i !== void 0 ? i : (a, u) => o(Lt(a, u)), this.extensions = J(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (r = t.extensionASTNodes) !== null && r !== void 0 ? r : [], t.specifiedByURL == null || typeof t.specifiedByURL == "string" || w(
      !1,
      `${this.name} must provide "specifiedByURL" as a string, but got: ${_(t.specifiedByURL)}.`
    ), t.serialize == null || typeof t.serialize == "function" || w(
      !1,
      `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`
    ), t.parseLiteral && (typeof t.parseValue == "function" && typeof t.parseLiteral == "function" || w(
      !1,
      `${this.name} must provide both "parseValue" and "parseLiteral" functions.`
    ));
  }
  get [Symbol.toStringTag]() {
    return "GraphQLScalarType";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      specifiedByURL: this.specifiedByURL,
      serialize: this.serialize,
      parseValue: this.parseValue,
      parseLiteral: this.parseLiteral,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
class we {
  constructor(t) {
    var n;
    this.name = Z(t.name), this.description = t.description, this.isTypeOf = t.isTypeOf, this.extensions = J(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._fields = () => Wn(t), this._interfaces = () => Hn(t), t.isTypeOf == null || typeof t.isTypeOf == "function" || w(
      !1,
      `${this.name} must provide "isTypeOf" as a function, but got: ${_(t.isTypeOf)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLObjectType";
  }
  getFields() {
    return typeof this._fields == "function" && (this._fields = this._fields()), this._fields;
  }
  getInterfaces() {
    return typeof this._interfaces == "function" && (this._interfaces = this._interfaces()), this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: Kn(this.getFields()),
      isTypeOf: this.isTypeOf,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function Hn(e) {
  var t;
  const n = Yn(
    (t = e.interfaces) !== null && t !== void 0 ? t : []
  );
  return Array.isArray(n) || w(
    !1,
    `${e.name} interfaces must be an Array or a function which returns an Array.`
  ), n;
}
function Wn(e) {
  const t = Qn(e.fields);
  return De(t) || w(
    !1,
    `${e.name} fields must be an object with field names as keys or a function which returns such an object.`
  ), Et(t, (n, s) => {
    var i;
    De(n) || w(
      !1,
      `${e.name}.${s} field config must be an object.`
    ), n.resolve == null || typeof n.resolve == "function" || w(
      !1,
      `${e.name}.${s} field resolver must be a function if provided, but got: ${_(n.resolve)}.`
    );
    const r = (i = n.args) !== null && i !== void 0 ? i : {};
    return De(r) || w(
      !1,
      `${e.name}.${s} args must be an object with argument names as keys.`
    ), {
      name: Z(s),
      description: n.description,
      type: n.type,
      args: qn(r),
      resolve: n.resolve,
      subscribe: n.subscribe,
      deprecationReason: n.deprecationReason,
      extensions: J(n.extensions),
      astNode: n.astNode
    };
  });
}
function qn(e) {
  return Object.entries(e).map(([t, n]) => ({
    name: Z(t),
    description: n.description,
    type: n.type,
    defaultValue: n.defaultValue,
    deprecationReason: n.deprecationReason,
    extensions: J(n.extensions),
    astNode: n.astNode
  }));
}
function De(e) {
  return ge(e) && !Array.isArray(e);
}
function Kn(e) {
  return Et(e, (t) => ({
    description: t.description,
    type: t.type,
    args: zn(t.args),
    resolve: t.resolve,
    subscribe: t.subscribe,
    deprecationReason: t.deprecationReason,
    extensions: t.extensions,
    astNode: t.astNode
  }));
}
function zn(e) {
  return Jt(
    e,
    (t) => t.name,
    (t) => ({
      description: t.description,
      type: t.type,
      defaultValue: t.defaultValue,
      deprecationReason: t.deprecationReason,
      extensions: t.extensions,
      astNode: t.astNode
    })
  );
}
class xi {
  constructor(t) {
    var n;
    this.name = Z(t.name), this.description = t.description, this.resolveType = t.resolveType, this.extensions = J(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._fields = Wn.bind(void 0, t), this._interfaces = Hn.bind(void 0, t), t.resolveType == null || typeof t.resolveType == "function" || w(
      !1,
      `${this.name} must provide "resolveType" as a function, but got: ${_(t.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInterfaceType";
  }
  getFields() {
    return typeof this._fields == "function" && (this._fields = this._fields()), this._fields;
  }
  getInterfaces() {
    return typeof this._interfaces == "function" && (this._interfaces = this._interfaces()), this._interfaces;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      interfaces: this.getInterfaces(),
      fields: Kn(this.getFields()),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
class Li {
  constructor(t) {
    var n;
    this.name = Z(t.name), this.description = t.description, this.resolveType = t.resolveType, this.extensions = J(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._types = Ci.bind(void 0, t), t.resolveType == null || typeof t.resolveType == "function" || w(
      !1,
      `${this.name} must provide "resolveType" as a function, but got: ${_(t.resolveType)}.`
    );
  }
  get [Symbol.toStringTag]() {
    return "GraphQLUnionType";
  }
  getTypes() {
    return typeof this._types == "function" && (this._types = this._types()), this._types;
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      types: this.getTypes(),
      resolveType: this.resolveType,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function Ci(e) {
  const t = Yn(e.types);
  return Array.isArray(t) || w(
    !1,
    `Must provide Array of types or a function which returns such an array for Union ${e.name}.`
  ), t;
}
class Yt {
  /* <T> */
  constructor(t) {
    var n;
    this.name = Z(t.name), this.description = t.description, this.extensions = J(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._values = typeof t.values == "function" ? t.values : cn(this.name, t.values), this._valueLookup = null, this._nameLookup = null;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLEnumType";
  }
  getValues() {
    return typeof this._values == "function" && (this._values = cn(this.name, this._values())), this._values;
  }
  getValue(t) {
    return this._nameLookup === null && (this._nameLookup = hi(this.getValues(), (n) => n.name)), this._nameLookup[t];
  }
  serialize(t) {
    this._valueLookup === null && (this._valueLookup = new Map(
      this.getValues().map((s) => [s.value, s])
    ));
    const n = this._valueLookup.get(t);
    if (n === void 0)
      throw new O(
        `Enum "${this.name}" cannot represent value: ${_(t)}`
      );
    return n.name;
  }
  parseValue(t) {
    if (typeof t != "string") {
      const s = _(t);
      throw new O(
        `Enum "${this.name}" cannot represent non-string value: ${s}.` + st(this, s)
      );
    }
    const n = this.getValue(t);
    if (n == null)
      throw new O(
        `Value "${t}" does not exist in "${this.name}" enum.` + st(this, t)
      );
    return n.value;
  }
  parseLiteral(t, n) {
    if (t.kind !== c.ENUM) {
      const i = pe(t);
      throw new O(
        `Enum "${this.name}" cannot represent non-enum value: ${i}.` + st(this, i),
        {
          nodes: t
        }
      );
    }
    const s = this.getValue(t.value);
    if (s == null) {
      const i = pe(t);
      throw new O(
        `Value "${i}" does not exist in "${this.name}" enum.` + st(this, i),
        {
          nodes: t
        }
      );
    }
    return s.value;
  }
  toConfig() {
    const t = Jt(
      this.getValues(),
      (n) => n.name,
      (n) => ({
        description: n.description,
        value: n.value,
        deprecationReason: n.deprecationReason,
        extensions: n.extensions,
        astNode: n.astNode
      })
    );
    return {
      name: this.name,
      description: this.description,
      values: t,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function st(e, t) {
  const n = e.getValues().map((i) => i.name), s = vi(t, n);
  return fi("the enum value", s);
}
function cn(e, t) {
  return De(t) || w(
    !1,
    `${e} values must be an object with value names as keys.`
  ), Object.entries(t).map(([n, s]) => (De(s) || w(
    !1,
    `${e}.${n} must refer to an object with a "value" key representing an internal value but got: ${_(s)}.`
  ), {
    name: Ri(n),
    description: s.description,
    value: s.value !== void 0 ? s.value : n,
    deprecationReason: s.deprecationReason,
    extensions: J(s.extensions),
    astNode: s.astNode
  }));
}
class Ui {
  constructor(t) {
    var n, s;
    this.name = Z(t.name), this.description = t.description, this.extensions = J(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this.isOneOf = (s = t.isOneOf) !== null && s !== void 0 ? s : !1, this._fields = Pi.bind(void 0, t);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInputObjectType";
  }
  getFields() {
    return typeof this._fields == "function" && (this._fields = this._fields()), this._fields;
  }
  toConfig() {
    const t = Et(this.getFields(), (n) => ({
      description: n.description,
      type: n.type,
      defaultValue: n.defaultValue,
      deprecationReason: n.deprecationReason,
      extensions: n.extensions,
      astNode: n.astNode
    }));
    return {
      name: this.name,
      description: this.description,
      fields: t,
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      isOneOf: this.isOneOf
    };
  }
  toString() {
    return this.name;
  }
  toJSON() {
    return this.toString();
  }
}
function Pi(e) {
  const t = Qn(e.fields);
  return De(t) || w(
    !1,
    `${e.name} fields must be an object with field names as keys or a function which returns such an object.`
  ), Et(t, (n, s) => (!("resolve" in n) || w(
    !1,
    `${e.name}.${s} field has a resolve property, but Input Types cannot define resolvers.`
  ), {
    name: Z(s),
    description: n.description,
    type: n.type,
    defaultValue: n.defaultValue,
    deprecationReason: n.deprecationReason,
    extensions: J(n.extensions),
    astNode: n.astNode
  }));
}
const Ot = 2147483647, wt = -2147483648, Fi = new Ve({
  name: "Int",
  description: "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",
  serialize(e) {
    const t = Xe(e);
    if (typeof t == "boolean")
      return t ? 1 : 0;
    let n = t;
    if (typeof t == "string" && t !== "" && (n = Number(t)), typeof n != "number" || !Number.isInteger(n))
      throw new O(
        `Int cannot represent non-integer value: ${_(t)}`
      );
    if (n > Ot || n < wt)
      throw new O(
        "Int cannot represent non 32-bit signed integer value: " + _(t)
      );
    return n;
  },
  parseValue(e) {
    if (typeof e != "number" || !Number.isInteger(e))
      throw new O(
        `Int cannot represent non-integer value: ${_(e)}`
      );
    if (e > Ot || e < wt)
      throw new O(
        `Int cannot represent non 32-bit signed integer value: ${e}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== c.INT)
      throw new O(
        `Int cannot represent non-integer value: ${pe(e)}`,
        {
          nodes: e
        }
      );
    const t = parseInt(e.value, 10);
    if (t > Ot || t < wt)
      throw new O(
        `Int cannot represent non 32-bit signed integer value: ${e.value}`,
        {
          nodes: e
        }
      );
    return t;
  }
}), Vi = new Ve({
  name: "Float",
  description: "The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).",
  serialize(e) {
    const t = Xe(e);
    if (typeof t == "boolean")
      return t ? 1 : 0;
    let n = t;
    if (typeof t == "string" && t !== "" && (n = Number(t)), typeof n != "number" || !Number.isFinite(n))
      throw new O(
        `Float cannot represent non numeric value: ${_(t)}`
      );
    return n;
  },
  parseValue(e) {
    if (typeof e != "number" || !Number.isFinite(e))
      throw new O(
        `Float cannot represent non numeric value: ${_(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== c.FLOAT && e.kind !== c.INT)
      throw new O(
        `Float cannot represent non numeric value: ${pe(e)}`,
        e
      );
    return parseFloat(e.value);
  }
}), x = new Ve({
  name: "String",
  description: "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
  serialize(e) {
    const t = Xe(e);
    if (typeof t == "string")
      return t;
    if (typeof t == "boolean")
      return t ? "true" : "false";
    if (typeof t == "number" && Number.isFinite(t))
      return t.toString();
    throw new O(
      `String cannot represent value: ${_(e)}`
    );
  },
  parseValue(e) {
    if (typeof e != "string")
      throw new O(
        `String cannot represent a non string value: ${_(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== c.STRING)
      throw new O(
        `String cannot represent a non string value: ${pe(e)}`,
        {
          nodes: e
        }
      );
    return e.value;
  }
}), B = new Ve({
  name: "Boolean",
  description: "The `Boolean` scalar type represents `true` or `false`.",
  serialize(e) {
    const t = Xe(e);
    if (typeof t == "boolean")
      return t;
    if (Number.isFinite(t))
      return t !== 0;
    throw new O(
      `Boolean cannot represent a non boolean value: ${_(t)}`
    );
  },
  parseValue(e) {
    if (typeof e != "boolean")
      throw new O(
        `Boolean cannot represent a non boolean value: ${_(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== c.BOOLEAN)
      throw new O(
        `Boolean cannot represent a non boolean value: ${pe(e)}`,
        {
          nodes: e
        }
      );
    return e.value;
  }
}), Xn = new Ve({
  name: "ID",
  description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize(e) {
    const t = Xe(e);
    if (typeof t == "string")
      return t;
    if (Number.isInteger(t))
      return String(t);
    throw new O(
      `ID cannot represent value: ${_(e)}`
    );
  },
  parseValue(e) {
    if (typeof e == "string")
      return e;
    if (typeof e == "number" && Number.isInteger(e))
      return e.toString();
    throw new O(`ID cannot represent value: ${_(e)}`);
  },
  parseLiteral(e) {
    if (e.kind !== c.STRING && e.kind !== c.INT)
      throw new O(
        "ID cannot represent a non-string and non-integer value: " + pe(e),
        {
          nodes: e
        }
      );
    return e.value;
  }
}), Mi = Object.freeze([
  x,
  Fi,
  Vi,
  B,
  Xn
]);
function $i(e) {
  return Mi.some(({ name: t }) => e.name === t);
}
function Xe(e) {
  if (ge(e)) {
    if (typeof e.valueOf == "function") {
      const t = e.valueOf();
      if (!ge(t))
        return t;
    }
    if (typeof e.toJSON == "function")
      return e.toJSON();
  }
  return e;
}
function Bi(e) {
  return X(e, Me);
}
class Me {
  constructor(t) {
    var n, s;
    this.name = Z(t.name), this.description = t.description, this.locations = t.locations, this.isRepeatable = (n = t.isRepeatable) !== null && n !== void 0 ? n : !1, this.extensions = J(t.extensions), this.astNode = t.astNode, Array.isArray(t.locations) || w(!1, `@${t.name} locations must be an Array.`);
    const i = (s = t.args) !== null && s !== void 0 ? s : {};
    ge(i) && !Array.isArray(i) || w(
      !1,
      `@${t.name} args must be an object with argument names as keys.`
    ), this.args = qn(i);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLDirective";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: zn(this.args),
      isRepeatable: this.isRepeatable,
      extensions: this.extensions,
      astNode: this.astNode
    };
  }
  toString() {
    return "@" + this.name;
  }
  toJSON() {
    return this.toString();
  }
}
const ji = new Me({
  name: "include",
  description: "Directs the executor to include this field or fragment only when the `if` argument is true.",
  locations: [
    N.FIELD,
    N.FRAGMENT_SPREAD,
    N.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new S(B),
      description: "Included when true."
    }
  }
}), Gi = new Me({
  name: "skip",
  description: "Directs the executor to skip this field or fragment when the `if` argument is true.",
  locations: [
    N.FIELD,
    N.FRAGMENT_SPREAD,
    N.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new S(B),
      description: "Skipped when true."
    }
  }
}), Ji = "No longer supported", Zn = new Me({
  name: "deprecated",
  description: "Marks an element of a GraphQL schema as no longer supported.",
  locations: [
    N.FIELD_DEFINITION,
    N.ARGUMENT_DEFINITION,
    N.INPUT_FIELD_DEFINITION,
    N.ENUM_VALUE
  ],
  args: {
    reason: {
      type: x,
      description: "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
      defaultValue: Ji
    }
  }
}), Yi = new Me({
  name: "specifiedBy",
  description: "Exposes a URL that specifies the behavior of this scalar.",
  locations: [N.SCALAR],
  args: {
    url: {
      type: new S(x),
      description: "The URL that specifies the behavior of this scalar."
    }
  }
}), Qi = new Me({
  name: "oneOf",
  description: "Indicates exactly one field must be supplied and this field must not be `null`.",
  locations: [N.INPUT_OBJECT],
  args: {}
}), es = Object.freeze([
  ji,
  Gi,
  Zn,
  Yi,
  Qi
]);
function Hi(e) {
  return es.some(({ name: t }) => t === e.name);
}
function Wi(e) {
  return typeof e == "object" && typeof e?.[Symbol.iterator] == "function";
}
function Qe(e, t) {
  if (Oe(t)) {
    const n = Qe(e, t.ofType);
    return n?.kind === c.NULL ? null : n;
  }
  if (e === null)
    return {
      kind: c.NULL
    };
  if (e === void 0)
    return null;
  if (Fe(t)) {
    const n = t.ofType;
    if (Wi(e)) {
      const s = [];
      for (const i of e) {
        const r = Qe(i, n);
        r != null && s.push(r);
      }
      return {
        kind: c.LIST,
        values: s
      };
    }
    return Qe(e, n);
  }
  if (le(t)) {
    if (!ge(e))
      return null;
    const n = [];
    for (const s of Object.values(t.getFields())) {
      const i = Qe(e[s.name], s.type);
      i && n.push({
        kind: c.OBJECT_FIELD,
        name: {
          kind: c.NAME,
          value: s.name
        },
        value: i
      });
    }
    return {
      kind: c.OBJECT,
      fields: n
    };
  }
  if (Jn(t)) {
    const n = t.serialize(e);
    if (n == null)
      return null;
    if (typeof n == "boolean")
      return {
        kind: c.BOOLEAN,
        value: n
      };
    if (typeof n == "number" && Number.isFinite(n)) {
      const s = String(n);
      return un.test(s) ? {
        kind: c.INT,
        value: s
      } : {
        kind: c.FLOAT,
        value: s
      };
    }
    if (typeof n == "string")
      return Ie(t) ? {
        kind: c.ENUM,
        value: n
      } : t === Xn && un.test(n) ? {
        kind: c.INT,
        value: n
      } : {
        kind: c.STRING,
        value: n
      };
    throw new TypeError(`Cannot convert value to AST: ${_(n)}.`);
  }
  Bt(!1, "Unexpected input type: " + _(t));
}
const un = /^-?(?:0|[1-9][0-9]*)$/, Qt = new we({
  name: "__Schema",
  description: "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
  fields: () => ({
    description: {
      type: x,
      resolve: (e) => e.description
    },
    types: {
      description: "A list of all types supported by this server.",
      type: new S(new q(new S(K))),
      resolve(e) {
        return Object.values(e.getTypeMap());
      }
    },
    queryType: {
      description: "The type that query operations will be rooted at.",
      type: new S(K),
      resolve: (e) => e.getQueryType()
    },
    mutationType: {
      description: "If this server supports mutation, the type that mutation operations will be rooted at.",
      type: K,
      resolve: (e) => e.getMutationType()
    },
    subscriptionType: {
      description: "If this server support subscription, the type that subscription operations will be rooted at.",
      type: K,
      resolve: (e) => e.getSubscriptionType()
    },
    directives: {
      description: "A list of all directives supported by this server.",
      type: new S(
        new q(new S(ts))
      ),
      resolve: (e) => e.getDirectives()
    }
  })
}), ts = new we({
  name: "__Directive",
  description: `A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.

In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.`,
  fields: () => ({
    name: {
      type: new S(x),
      resolve: (e) => e.name
    },
    description: {
      type: x,
      resolve: (e) => e.description
    },
    isRepeatable: {
      type: new S(B),
      resolve: (e) => e.isRepeatable
    },
    locations: {
      type: new S(
        new q(new S(ns))
      ),
      resolve: (e) => e.locations
    },
    args: {
      type: new S(
        new q(new S(gt))
      ),
      args: {
        includeDeprecated: {
          type: B,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        return t ? e.args : e.args.filter((n) => n.deprecationReason == null);
      }
    }
  })
}), ns = new Yt({
  name: "__DirectiveLocation",
  description: "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
  values: {
    QUERY: {
      value: N.QUERY,
      description: "Location adjacent to a query operation."
    },
    MUTATION: {
      value: N.MUTATION,
      description: "Location adjacent to a mutation operation."
    },
    SUBSCRIPTION: {
      value: N.SUBSCRIPTION,
      description: "Location adjacent to a subscription operation."
    },
    FIELD: {
      value: N.FIELD,
      description: "Location adjacent to a field."
    },
    FRAGMENT_DEFINITION: {
      value: N.FRAGMENT_DEFINITION,
      description: "Location adjacent to a fragment definition."
    },
    FRAGMENT_SPREAD: {
      value: N.FRAGMENT_SPREAD,
      description: "Location adjacent to a fragment spread."
    },
    INLINE_FRAGMENT: {
      value: N.INLINE_FRAGMENT,
      description: "Location adjacent to an inline fragment."
    },
    VARIABLE_DEFINITION: {
      value: N.VARIABLE_DEFINITION,
      description: "Location adjacent to a variable definition."
    },
    SCHEMA: {
      value: N.SCHEMA,
      description: "Location adjacent to a schema definition."
    },
    SCALAR: {
      value: N.SCALAR,
      description: "Location adjacent to a scalar definition."
    },
    OBJECT: {
      value: N.OBJECT,
      description: "Location adjacent to an object type definition."
    },
    FIELD_DEFINITION: {
      value: N.FIELD_DEFINITION,
      description: "Location adjacent to a field definition."
    },
    ARGUMENT_DEFINITION: {
      value: N.ARGUMENT_DEFINITION,
      description: "Location adjacent to an argument definition."
    },
    INTERFACE: {
      value: N.INTERFACE,
      description: "Location adjacent to an interface definition."
    },
    UNION: {
      value: N.UNION,
      description: "Location adjacent to a union definition."
    },
    ENUM: {
      value: N.ENUM,
      description: "Location adjacent to an enum definition."
    },
    ENUM_VALUE: {
      value: N.ENUM_VALUE,
      description: "Location adjacent to an enum value definition."
    },
    INPUT_OBJECT: {
      value: N.INPUT_OBJECT,
      description: "Location adjacent to an input object type definition."
    },
    INPUT_FIELD_DEFINITION: {
      value: N.INPUT_FIELD_DEFINITION,
      description: "Location adjacent to an input object field definition."
    }
  }
}), K = new we({
  name: "__Type",
  description: "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
  fields: () => ({
    kind: {
      type: new S(rs),
      resolve(e) {
        if (vt(e))
          return P.SCALAR;
        if (Ee(e))
          return P.OBJECT;
        if (te(e))
          return P.INTERFACE;
        if (Te(e))
          return P.UNION;
        if (Ie(e))
          return P.ENUM;
        if (le(e))
          return P.INPUT_OBJECT;
        if (Fe(e))
          return P.LIST;
        if (Oe(e))
          return P.NON_NULL;
        Bt(!1, `Unexpected type: "${_(e)}".`);
      }
    },
    name: {
      type: x,
      resolve: (e) => "name" in e ? e.name : void 0
    },
    description: {
      type: x,
      resolve: (e) => (
        /* c8 ignore next */
        "description" in e ? e.description : void 0
      )
    },
    specifiedByURL: {
      type: x,
      resolve: (e) => "specifiedByURL" in e ? e.specifiedByURL : void 0
    },
    fields: {
      type: new q(new S(ss)),
      args: {
        includeDeprecated: {
          type: B,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (Ee(e) || te(e)) {
          const n = Object.values(e.getFields());
          return t ? n : n.filter((s) => s.deprecationReason == null);
        }
      }
    },
    interfaces: {
      type: new q(new S(K)),
      resolve(e) {
        if (Ee(e) || te(e))
          return e.getInterfaces();
      }
    },
    possibleTypes: {
      type: new q(new S(K)),
      resolve(e, t, n, { schema: s }) {
        if (Ai(e))
          return s.getPossibleTypes(e);
      }
    },
    enumValues: {
      type: new q(new S(is)),
      args: {
        includeDeprecated: {
          type: B,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (Ie(e)) {
          const n = e.getValues();
          return t ? n : n.filter((s) => s.deprecationReason == null);
        }
      }
    },
    inputFields: {
      type: new q(new S(gt)),
      args: {
        includeDeprecated: {
          type: B,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (le(e)) {
          const n = Object.values(e.getFields());
          return t ? n : n.filter((s) => s.deprecationReason == null);
        }
      }
    },
    ofType: {
      type: K,
      resolve: (e) => "ofType" in e ? e.ofType : void 0
    },
    isOneOf: {
      type: B,
      resolve: (e) => {
        if (le(e))
          return e.isOneOf;
      }
    }
  })
}), ss = new we({
  name: "__Field",
  description: "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
  fields: () => ({
    name: {
      type: new S(x),
      resolve: (e) => e.name
    },
    description: {
      type: x,
      resolve: (e) => e.description
    },
    args: {
      type: new S(
        new q(new S(gt))
      ),
      args: {
        includeDeprecated: {
          type: B,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        return t ? e.args : e.args.filter((n) => n.deprecationReason == null);
      }
    },
    type: {
      type: new S(K),
      resolve: (e) => e.type
    },
    isDeprecated: {
      type: new S(B),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: x,
      resolve: (e) => e.deprecationReason
    }
  })
}), gt = new we({
  name: "__InputValue",
  description: "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
  fields: () => ({
    name: {
      type: new S(x),
      resolve: (e) => e.name
    },
    description: {
      type: x,
      resolve: (e) => e.description
    },
    type: {
      type: new S(K),
      resolve: (e) => e.type
    },
    defaultValue: {
      type: x,
      description: "A GraphQL-formatted string representing the default value for this input value.",
      resolve(e) {
        const { type: t, defaultValue: n } = e, s = Qe(n, t);
        return s ? pe(s) : null;
      }
    },
    isDeprecated: {
      type: new S(B),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: x,
      resolve: (e) => e.deprecationReason
    }
  })
}), is = new we({
  name: "__EnumValue",
  description: "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
  fields: () => ({
    name: {
      type: new S(x),
      resolve: (e) => e.name
    },
    description: {
      type: x,
      resolve: (e) => e.description
    },
    isDeprecated: {
      type: new S(B),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: x,
      resolve: (e) => e.deprecationReason
    }
  })
});
var P;
(function(e) {
  e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.INPUT_OBJECT = "INPUT_OBJECT", e.LIST = "LIST", e.NON_NULL = "NON_NULL";
})(P || (P = {}));
const rs = new Yt({
  name: "__TypeKind",
  description: "An enum describing what kind of type a given `__Type` is.",
  values: {
    SCALAR: {
      value: P.SCALAR,
      description: "Indicates this type is a scalar."
    },
    OBJECT: {
      value: P.OBJECT,
      description: "Indicates this type is an object. `fields` and `interfaces` are valid fields."
    },
    INTERFACE: {
      value: P.INTERFACE,
      description: "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields."
    },
    UNION: {
      value: P.UNION,
      description: "Indicates this type is a union. `possibleTypes` is a valid field."
    },
    ENUM: {
      value: P.ENUM,
      description: "Indicates this type is an enum. `enumValues` is a valid field."
    },
    INPUT_OBJECT: {
      value: P.INPUT_OBJECT,
      description: "Indicates this type is an input object. `inputFields` is a valid field."
    },
    LIST: {
      value: P.LIST,
      description: "Indicates this type is a list. `ofType` is a valid field."
    },
    NON_NULL: {
      value: P.NON_NULL,
      description: "Indicates this type is a non-null. `ofType` is a valid field."
    }
  }
});
new S(Qt);
new S(x);
new S(x);
const qi = Object.freeze([
  Qt,
  ts,
  ns,
  K,
  ss,
  gt,
  is,
  rs
]);
function Ki(e) {
  return qi.some(({ name: t }) => e.name === t);
}
function zi(e) {
  return X(e, Xi);
}
class Xi {
  // Used as a cache for validateSchema().
  constructor(t) {
    var n, s;
    this.__validationErrors = t.assumeValid === !0 ? [] : void 0, ge(t) || w(!1, "Must provide configuration object."), !t.types || Array.isArray(t.types) || w(
      !1,
      `"types" must be Array if provided but got: ${_(t.types)}.`
    ), !t.directives || Array.isArray(t.directives) || w(
      !1,
      `"directives" must be Array if provided but got: ${_(t.directives)}.`
    ), this.description = t.description, this.extensions = J(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._queryType = t.query, this._mutationType = t.mutation, this._subscriptionType = t.subscription, this._directives = (s = t.directives) !== null && s !== void 0 ? s : es;
    const i = new Set(t.types);
    if (t.types != null)
      for (const r of t.types)
        i.delete(r), W(r, i);
    this._queryType != null && W(this._queryType, i), this._mutationType != null && W(this._mutationType, i), this._subscriptionType != null && W(this._subscriptionType, i);
    for (const r of this._directives)
      if (Bi(r))
        for (const o of r.args)
          W(o.type, i);
    W(Qt, i), this._typeMap = /* @__PURE__ */ Object.create(null), this._subTypeMap = /* @__PURE__ */ Object.create(null), this._implementationsMap = /* @__PURE__ */ Object.create(null);
    for (const r of i) {
      if (r == null)
        continue;
      const o = r.name;
      if (o || w(
        !1,
        "One of the provided types for building the Schema is missing a name."
      ), this._typeMap[o] !== void 0)
        throw new Error(
          `Schema must contain uniquely named types but contains multiple types named "${o}".`
        );
      if (this._typeMap[o] = r, te(r)) {
        for (const a of r.getInterfaces())
          if (te(a)) {
            let u = this._implementationsMap[a.name];
            u === void 0 && (u = this._implementationsMap[a.name] = {
              objects: [],
              interfaces: []
            }), u.interfaces.push(r);
          }
      } else if (Ee(r)) {
        for (const a of r.getInterfaces())
          if (te(a)) {
            let u = this._implementationsMap[a.name];
            u === void 0 && (u = this._implementationsMap[a.name] = {
              objects: [],
              interfaces: []
            }), u.objects.push(r);
          }
      }
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLSchema";
  }
  getQueryType() {
    return this._queryType;
  }
  getMutationType() {
    return this._mutationType;
  }
  getSubscriptionType() {
    return this._subscriptionType;
  }
  getRootType(t) {
    switch (t) {
      case re.QUERY:
        return this.getQueryType();
      case re.MUTATION:
        return this.getMutationType();
      case re.SUBSCRIPTION:
        return this.getSubscriptionType();
    }
  }
  getTypeMap() {
    return this._typeMap;
  }
  getType(t) {
    return this.getTypeMap()[t];
  }
  getPossibleTypes(t) {
    return Te(t) ? t.getTypes() : this.getImplementations(t).objects;
  }
  getImplementations(t) {
    const n = this._implementationsMap[t.name];
    return n ?? {
      objects: [],
      interfaces: []
    };
  }
  isSubType(t, n) {
    let s = this._subTypeMap[t.name];
    if (s === void 0) {
      if (s = /* @__PURE__ */ Object.create(null), Te(t))
        for (const i of t.getTypes())
          s[i.name] = !0;
      else {
        const i = this.getImplementations(t);
        for (const r of i.objects)
          s[r.name] = !0;
        for (const r of i.interfaces)
          s[r.name] = !0;
      }
      this._subTypeMap[t.name] = s;
    }
    return s[n.name] !== void 0;
  }
  getDirectives() {
    return this._directives;
  }
  getDirective(t) {
    return this.getDirectives().find((n) => n.name === t);
  }
  toConfig() {
    return {
      description: this.description,
      query: this.getQueryType(),
      mutation: this.getMutationType(),
      subscription: this.getSubscriptionType(),
      types: Object.values(this.getTypeMap()),
      directives: this.getDirectives(),
      extensions: this.extensions,
      astNode: this.astNode,
      extensionASTNodes: this.extensionASTNodes,
      assumeValid: this.__validationErrors !== void 0
    };
  }
}
function W(e, t) {
  const n = Di(e);
  if (!t.has(n)) {
    if (t.add(n), Te(n))
      for (const s of n.getTypes())
        W(s, t);
    else if (Ee(n) || te(n)) {
      for (const s of n.getInterfaces())
        W(s, t);
      for (const s of Object.values(n.getFields())) {
        W(s.type, t);
        for (const i of s.args)
          W(i.type, t);
      }
    } else if (le(n))
      for (const s of Object.values(n.getFields()))
        W(s.type, t);
  }
  return t;
}
function Zi(e) {
  return er(e) || tr(e) || sr(e);
}
function er(e) {
  return e.kind === c.OPERATION_DEFINITION || e.kind === c.FRAGMENT_DEFINITION;
}
function tr(e) {
  return e.kind === c.SCHEMA_DEFINITION || nr(e) || e.kind === c.DIRECTIVE_DEFINITION;
}
function nr(e) {
  return e.kind === c.SCALAR_TYPE_DEFINITION || e.kind === c.OBJECT_TYPE_DEFINITION || e.kind === c.INTERFACE_TYPE_DEFINITION || e.kind === c.UNION_TYPE_DEFINITION || e.kind === c.ENUM_TYPE_DEFINITION || e.kind === c.INPUT_OBJECT_TYPE_DEFINITION;
}
function sr(e) {
  return e.kind === c.SCHEMA_EXTENSION || ir(e);
}
function ir(e) {
  return e.kind === c.SCALAR_TYPE_EXTENSION || e.kind === c.OBJECT_TYPE_EXTENSION || e.kind === c.INTERFACE_TYPE_EXTENSION || e.kind === c.UNION_TYPE_EXTENSION || e.kind === c.ENUM_TYPE_EXTENSION || e.kind === c.INPUT_OBJECT_TYPE_EXTENSION;
}
const rr = async (e, t) => {
  const n = e.config.graphql.plugins, s = {
    config: e.config,
    database: e.slonik,
    dbSchema: e.dbSchema
  };
  if (n)
    for (const i of n)
      await i.updateContext(s, e, t);
  return s;
}, or = async (e) => {
  const t = e.config.graphql;
  t?.enabled ? await e.register(g, {
    context: rr,
    ...t
  }) : e.log.info("GraphQL API not enabled");
};
Ue(or);
var at = function() {
  return at = Object.assign || function(e) {
    for (var t, n = 1, s = arguments.length; n < s; n++) {
      t = arguments[n];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, at.apply(this, arguments);
}, ot = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map(), os = !0, ct = !1;
function as(e) {
  return e.replace(/[\s,]+/g, " ").trim();
}
function ar(e) {
  return as(e.source.body.substring(e.start, e.end));
}
function cr(e) {
  var t = /* @__PURE__ */ new Set(), n = [];
  return e.definitions.forEach(function(s) {
    if (s.kind === "FragmentDefinition") {
      var i = s.name.value, r = ar(s.loc), o = Ct.get(i);
      o && !o.has(r) ? os && console.warn("Warning: fragment with name " + i + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : o || Ct.set(i, o = /* @__PURE__ */ new Set()), o.add(r), t.has(r) || (t.add(r), n.push(s));
    } else
      n.push(s);
  }), at(at({}, e), { definitions: n });
}
function ur(e) {
  var t = new Set(e.definitions);
  t.forEach(function(s) {
    s.loc && delete s.loc, Object.keys(s).forEach(function(i) {
      var r = s[i];
      r && typeof r == "object" && t.add(r);
    });
  });
  var n = e.loc;
  return n && (delete n.startToken, delete n.endToken), e;
}
function lr(e) {
  var t = as(e);
  if (!ot.has(t)) {
    var n = $n(e, {
      experimentalFragmentVariables: ct,
      allowLegacyFragmentVariables: ct
    });
    if (!n || n.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    ot.set(t, ur(cr(n)));
  }
  return ot.get(t);
}
function oe(e) {
  for (var t = [], n = 1; n < arguments.length; n++)
    t[n - 1] = arguments[n];
  typeof e == "string" && (e = [e]);
  var s = e[0];
  return t.forEach(function(i, r) {
    i && i.kind === "Document" ? s += i.loc.source.body : s += i, s += e[r + 1];
  }), lr(s);
}
function dr() {
  ot.clear(), Ct.clear();
}
function pr() {
  os = !1;
}
function fr() {
  ct = !0;
}
function hr() {
  ct = !1;
}
var Ge = {
  gql: oe,
  resetCaches: dr,
  disableFragmentWarnings: pr,
  enableExperimentalFragmentVariables: fr,
  disableExperimentalFragmentVariables: hr
};
(function(e) {
  e.gql = Ge.gql, e.resetCaches = Ge.resetCaches, e.disableFragmentWarnings = Ge.disableFragmentWarnings, e.enableExperimentalFragmentVariables = Ge.enableExperimentalFragmentVariables, e.disableExperimentalFragmentVariables = Ge.disableExperimentalFragmentVariables;
})(oe || (oe = {}));
oe.default = oe;
function mr(e, t) {
  return String(e) < String(t) ? -1 : String(e) > String(t) ? 1 : 0;
}
function ln(e) {
  let t;
  return "alias" in e && (t = e.alias?.value), t == null && "name" in e && (t = e.name?.value), t == null && (t = e.kind), t;
}
function yt(e, t, n) {
  const s = ln(e), i = ln(t);
  return typeof n == "function" ? n(s, i) : mr(s, i);
}
function Ht(e) {
  return e != null;
}
const cs = 3;
function us(e) {
  return Tt(e, []);
}
function Tt(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return Er(e, t);
    default:
      return String(e);
  }
}
function dn(e) {
  return (e.name = "GraphQLError") ? e.toString() : `${e.name}: ${e.message};
 ${e.stack}`;
}
function Er(e, t) {
  if (e === null)
    return "null";
  if (e instanceof Error)
    return e.name === "AggregateError" ? dn(e) + `
` + pn(e.errors, t) : dn(e);
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (vr(e)) {
    const s = e.toJSON();
    if (s !== e)
      return typeof s == "string" ? s : Tt(s, n);
  } else if (Array.isArray(e))
    return pn(e, n);
  return gr(e, n);
}
function vr(e) {
  return typeof e.toJSON == "function";
}
function gr(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > cs ? "[" + yr(e) + "]" : "{ " + n.map(([s, i]) => s + ": " + Tt(i, t)).join(", ") + " }";
}
function pn(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > cs)
    return "[Array]";
  const n = e.length, s = [];
  for (let i = 0; i < n; ++i)
    s.push(Tt(e[i], t));
  return "[" + s.join(", ") + "]";
}
function yr(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
function Tr(e) {
  return e != null && typeof e == "object" && Symbol.iterator in e;
}
function Ir(e) {
  return typeof e == "object" && e !== null;
}
function Wt(e, t = ["directives"]) {
  return t.reduce((n, s) => n == null ? n : n[s], e?.extensions);
}
function ae(e) {
  if (Oe(e)) {
    const t = ae(e.ofType);
    if (t.kind === c.NON_NULL_TYPE)
      throw new Error(`Invalid type node ${us(e)}. Inner type of non-null type cannot be a non-null type.`);
    return {
      kind: c.NON_NULL_TYPE,
      type: t
    };
  } else if (Fe(e))
    return {
      kind: c.LIST_TYPE,
      type: ae(e.ofType)
    };
  return {
    kind: c.NAMED_TYPE,
    name: {
      kind: c.NAME,
      value: e.name
    }
  };
}
function We(e) {
  if (e === null)
    return { kind: c.NULL };
  if (e === void 0)
    return null;
  if (Array.isArray(e)) {
    const t = [];
    for (const n of e) {
      const s = We(n);
      s != null && t.push(s);
    }
    return { kind: c.LIST, values: t };
  }
  if (typeof e == "object") {
    if (e?.toJSON)
      return We(e.toJSON());
    const t = [];
    for (const n in e) {
      const s = e[n], i = We(s);
      i && t.push({
        kind: c.OBJECT_FIELD,
        name: { kind: c.NAME, value: n },
        value: i
      });
    }
    return { kind: c.OBJECT, fields: t };
  }
  if (typeof e == "boolean")
    return { kind: c.BOOLEAN, value: e };
  if (typeof e == "bigint")
    return { kind: c.INT, value: String(e) };
  if (typeof e == "number" && isFinite(e)) {
    const t = String(e);
    return Nr.test(t) ? { kind: c.INT, value: t } : { kind: c.FLOAT, value: t };
  }
  if (typeof e == "string")
    return { kind: c.STRING, value: e };
  throw new TypeError(`Cannot convert value to AST: ${e}.`);
}
const Nr = /^-?(?:0|[1-9][0-9]*)$/;
function he(e, t) {
  if (Oe(t)) {
    const n = he(e, t.ofType);
    return n?.kind === c.NULL ? null : n;
  }
  if (e === null)
    return { kind: c.NULL };
  if (e === void 0)
    return null;
  if (Fe(t)) {
    const n = t.ofType;
    if (Tr(e)) {
      const s = [];
      for (const i of e) {
        const r = he(i, n);
        r != null && s.push(r);
      }
      return { kind: c.LIST, values: s };
    }
    return he(e, n);
  }
  if (le(t)) {
    if (!Ir(e))
      return null;
    const n = [];
    for (const s of Object.values(t.getFields())) {
      const i = he(e[s.name], s.type);
      i && n.push({
        kind: c.OBJECT_FIELD,
        name: { kind: c.NAME, value: s.name },
        value: i
      });
    }
    return { kind: c.OBJECT, fields: n };
  }
  if (Jn(t)) {
    const n = t.serialize(e);
    return n == null ? null : Ie(t) ? { kind: c.ENUM, value: n } : t.name === "ID" && typeof n == "string" && Sr.test(n) ? { kind: c.INT, value: n } : We(n);
  }
  console.assert(!1, "Unexpected input type: " + us(t));
}
const Sr = /^-?(?:0|[1-9][0-9]*)$/;
function Y(e) {
  if (e.astNode?.description)
    return {
      ...e.astNode.description,
      block: !0
    };
  if (e.description)
    return {
      kind: c.STRING,
      value: e.description,
      block: !0
    };
}
function Or(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return function(n) {
    const s = t.get(n);
    if (s === void 0) {
      const i = e(n);
      return t.set(n, i), i;
    }
    return s;
  };
}
const wr = Or(function(e) {
  const t = /* @__PURE__ */ new Map(), n = e.getQueryType();
  n && t.set("query", n);
  const s = e.getMutationType();
  s && t.set("mutation", s);
  const i = e.getSubscriptionType();
  return i && t.set("subscription", i), t;
});
function _r(e, t = {}) {
  const n = t.pathToDirectivesInExtensions, s = e.getTypeMap(), i = Rr(e, n), r = i != null ? [i] : [], o = e.getDirectives();
  for (const a of o)
    Hi(a) || r.push(Ar(a, e, n));
  for (const a in s) {
    const u = s[a], l = $i(u), d = Ki(u);
    if (!(l || d))
      if (Ee(u))
        r.push(br(u, e, n));
      else if (te(u))
        r.push(kr(u, e, n));
      else if (Te(u))
        r.push(Dr(u, e, n));
      else if (le(u))
        r.push(xr(u, e, n));
      else if (Ie(u))
        r.push(Lr(u, e, n));
      else if (vt(u))
        r.push(Cr(u, e, n));
      else
        throw new Error(`Unknown type ${u}.`);
  }
  return {
    kind: c.DOCUMENT,
    definitions: r
  };
}
function Rr(e, t) {
  const n = /* @__PURE__ */ new Map([
    ["query", void 0],
    ["mutation", void 0],
    ["subscription", void 0]
  ]), s = [];
  if (e.astNode != null && s.push(e.astNode), e.extensionASTNodes != null)
    for (const l of e.extensionASTNodes)
      s.push(l);
  for (const l of s)
    if (l.operationTypes)
      for (const d of l.operationTypes)
        n.set(d.operation, d);
  const i = wr(e);
  for (const [l, d] of n) {
    const f = i.get(l);
    if (f != null) {
      const E = ae(f);
      d != null ? d.type = E : n.set(l, {
        kind: c.OPERATION_TYPE_DEFINITION,
        operation: l,
        type: E
      });
    }
  }
  const r = [...n.values()].filter(Ht), o = $e(e, e, t);
  if (!r.length && !o.length)
    return null;
  const a = {
    kind: r != null ? c.SCHEMA_DEFINITION : c.SCHEMA_EXTENSION,
    operationTypes: r,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: o
  }, u = Y(e);
  return u && (a.description = u), a;
}
function Ar(e, t, n) {
  return {
    kind: c.DIRECTIVE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    arguments: e.args?.map((s) => ls(s, t, n)),
    repeatable: e.isRepeatable,
    locations: e.locations?.map((s) => ({
      kind: c.NAME,
      value: s
    })) || []
  };
}
function $e(e, t, n) {
  const s = Wt(e, n);
  let i = [];
  e.astNode != null && i.push(e.astNode), "extensionASTNodes" in e && e.extensionASTNodes != null && (i = i.concat(e.extensionASTNodes));
  let r;
  if (s != null)
    r = qt(t, s);
  else {
    r = [];
    for (const o of i)
      o.directives && r.push(...o.directives);
  }
  return r;
}
function It(e, t, n) {
  let s = [], i = null;
  const r = Wt(e, n);
  let o;
  return r != null ? o = qt(t, r) : o = e.astNode?.directives, o != null && (s = o.filter((a) => a.name.value !== "deprecated"), e.deprecationReason != null && (i = o.filter((a) => a.name.value === "deprecated")?.[0])), e.deprecationReason != null && i == null && (i = Fr(e.deprecationReason)), i == null ? s : [i].concat(s);
}
function ls(e, t, n) {
  return {
    kind: c.INPUT_VALUE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    type: ae(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    defaultValue: e.defaultValue !== void 0 ? he(e.defaultValue, e.type) ?? void 0 : void 0,
    directives: It(e, t, n)
  };
}
function br(e, t, n) {
  return {
    kind: c.OBJECT_TYPE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((s) => ds(s, t, n)),
    interfaces: Object.values(e.getInterfaces()).map((s) => ae(s)),
    directives: $e(e, t, n)
  };
}
function kr(e, t, n) {
  const s = {
    kind: c.INTERFACE_TYPE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((i) => ds(i, t, n)),
    directives: $e(e, t, n)
  };
  return "getInterfaces" in e && (s.interfaces = Object.values(e.getInterfaces()).map((i) => ae(i))), s;
}
function Dr(e, t, n) {
  return {
    kind: c.UNION_TYPE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: $e(e, t, n),
    types: e.getTypes().map((s) => ae(s))
  };
}
function xr(e, t, n) {
  return {
    kind: c.INPUT_OBJECT_TYPE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((s) => Ur(s, t, n)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: $e(e, t, n)
  };
}
function Lr(e, t, n) {
  return {
    kind: c.ENUM_TYPE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    values: Object.values(e.getValues()).map((s) => Pr(s, t, n)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: $e(e, t, n)
  };
}
function Cr(e, t, n) {
  const s = Wt(e, n), i = s ? qt(t, s) : e.astNode?.directives || [], r = e.specifiedByUrl || e.specifiedByURL;
  if (r && !i.some((o) => o.name.value === "specifiedBy")) {
    const o = {
      url: r
    };
    i.push(ut("specifiedBy", o));
  }
  return {
    kind: c.SCALAR_TYPE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: i
  };
}
function ds(e, t, n) {
  return {
    kind: c.FIELD_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    arguments: e.args.map((s) => ls(s, t, n)),
    type: ae(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: It(e, t, n)
  };
}
function Ur(e, t, n) {
  return {
    kind: c.INPUT_VALUE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    type: ae(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: It(e, t, n),
    defaultValue: he(e.defaultValue, e.type) ?? void 0
  };
}
function Pr(e, t, n) {
  return {
    kind: c.ENUM_VALUE_DEFINITION,
    description: Y(e),
    name: {
      kind: c.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: It(e, t, n)
  };
}
function Fr(e) {
  return ut("deprecated", { reason: e }, Zn);
}
function ut(e, t, n) {
  const s = [];
  if (n != null)
    for (const i of n.args) {
      const r = i.name, o = t[r];
      if (o !== void 0) {
        const a = he(o, i.type);
        a && s.push({
          kind: c.ARGUMENT,
          name: {
            kind: c.NAME,
            value: r
          },
          value: a
        });
      }
    }
  else
    for (const i in t) {
      const r = t[i], o = We(r);
      o && s.push({
        kind: c.ARGUMENT,
        name: {
          kind: c.NAME,
          value: i
        },
        value: o
      });
    }
  return {
    kind: c.DIRECTIVE,
    name: {
      kind: c.NAME,
      value: e
    },
    arguments: s
  };
}
function qt(e, t) {
  const n = [];
  for (const s in t) {
    const i = t[s], r = e?.getDirective(s);
    if (Array.isArray(i))
      for (const o of i)
        n.push(ut(s, o, r));
    else
      n.push(ut(s, i, r));
  }
  return n;
}
const Vr = 80;
let xe = {};
function Ut() {
  xe = {};
}
function Mr(e) {
  const t = e.name?.value;
  if (t != null)
    switch (it(e, t), e.kind) {
      case "EnumTypeDefinition":
        if (e.values)
          for (const n of e.values)
            it(n, t, n.name.value);
        break;
      case "ObjectTypeDefinition":
      case "InputObjectTypeDefinition":
      case "InterfaceTypeDefinition":
        if (e.fields) {
          for (const n of e.fields)
            if (it(n, t, n.name.value), Yr(n) && n.arguments)
              for (const s of n.arguments)
                it(s, t, n.name.value, s.name.value);
        }
        break;
    }
}
function it(e, t, n, s) {
  const i = Qr(e);
  if (typeof i != "string" || i.length === 0)
    return;
  const r = [t];
  n && (r.push(n), s && r.push(s));
  const o = r.join(".");
  xe[o] || (xe[o] = []), xe[o].push(i);
}
function $r(e) {
  return `
# ` + e.replace(/\n/g, `
# `);
}
function h(e, t) {
  return e ? e.filter((n) => n).join(t || "") : "";
}
function fn(e) {
  return e?.some((t) => t.includes(`
`)) ?? !1;
}
function Br(e) {
  return (t, n, s, i, r) => {
    const o = [], a = i.reduce((d, f) => (["fields", "arguments", "values"].includes(f) && d.name && o.push(d.name.value), d[f]), r[0]), u = [...o, a?.name?.value].filter(Boolean).join("."), l = [];
    return t.kind.includes("Definition") && xe[u] && l.push(...xe[u]), h([...l.map($r), t.description, e(t, n, s, i, r)], `
`);
  };
}
function qe(e) {
  return e && `  ${e.replace(/\n/g, `
  `)}`;
}
function H(e) {
  return e && e.length !== 0 ? `{
${qe(h(e, `
`))}
}` : "";
}
function b(e, t, n) {
  return t ? e + t + (n || "") : "";
}
function jr(e, t = !1) {
  const n = e.replace(/"""/g, '\\"""');
  return (e[0] === " " || e[0] === "	") && e.indexOf(`
`) === -1 ? `"""${n.replace(/"$/, `"
`)}"""` : `"""
${t ? n : qe(n)}
"""`;
}
const hn = {
  Name: { leave: (e) => e.value },
  Variable: { leave: (e) => "$" + e.name },
  // Document
  Document: {
    leave: (e) => h(e.definitions, `

`)
  },
  OperationDefinition: {
    leave: (e) => {
      const t = b("(", h(e.variableDefinitions, ", "), ")");
      return h([e.operation, h([e.name, t]), h(e.directives, " ")], " ") + " " + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: s }) => e + ": " + t + b(" = ", n) + b(" ", h(s, " "))
  },
  SelectionSet: { leave: ({ selections: e }) => H(e) },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: s, selectionSet: i }) {
      const r = b("", e, ": ") + t;
      let o = r + b("(", h(n, ", "), ")");
      return o.length > Vr && (o = r + b(`(
`, qe(h(n, `
`)), `
)`)), h([o, h(s, " "), i], " ");
    }
  },
  Argument: { leave: ({ name: e, value: t }) => e + ": " + t },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + b(" ", h(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => h(["...", b("on ", e), h(t, " "), n], " ")
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: s, selectionSet: i }) => (
      // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      `fragment ${e}${b("(", h(n, ", "), ")")} on ${t} ${b("", h(s, " "), " ")}` + i
    )
  },
  // Value
  IntValue: { leave: ({ value: e }) => e },
  FloatValue: { leave: ({ value: e }) => e },
  StringValue: {
    leave: ({ value: e, block: t }) => t ? jr(e) : JSON.stringify(e)
  },
  BooleanValue: { leave: ({ value: e }) => e ? "true" : "false" },
  NullValue: { leave: () => "null" },
  EnumValue: { leave: ({ value: e }) => e },
  ListValue: { leave: ({ values: e }) => "[" + h(e, ", ") + "]" },
  ObjectValue: { leave: ({ fields: e }) => "{" + h(e, ", ") + "}" },
  ObjectField: { leave: ({ name: e, value: t }) => e + ": " + t },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + b("(", h(t, ", "), ")")
  },
  // Type
  NamedType: { leave: ({ name: e }) => e },
  ListType: { leave: ({ type: e }) => "[" + e + "]" },
  NonNullType: { leave: ({ type: e }) => e + "!" },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ directives: e, operationTypes: t }) => h(["schema", h(e, " "), H(t)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ name: e, directives: t }) => h(["scalar", e, h(t, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ name: e, interfaces: t, directives: n, fields: s }) => h([
      "type",
      e,
      b("implements ", h(t, " & ")),
      h(n, " "),
      H(s)
    ], " ")
  },
  FieldDefinition: {
    leave: ({ name: e, arguments: t, type: n, directives: s }) => e + (fn(t) ? b(`(
`, qe(h(t, `
`)), `
)`) : b("(", h(t, ", "), ")")) + ": " + n + b(" ", h(s, " "))
  },
  InputValueDefinition: {
    leave: ({ name: e, type: t, defaultValue: n, directives: s }) => h([e + ": " + t, b("= ", n), h(s, " ")], " ")
  },
  InterfaceTypeDefinition: {
    leave: ({ name: e, interfaces: t, directives: n, fields: s }) => h([
      "interface",
      e,
      b("implements ", h(t, " & ")),
      h(n, " "),
      H(s)
    ], " ")
  },
  UnionTypeDefinition: {
    leave: ({ name: e, directives: t, types: n }) => h(["union", e, h(t, " "), b("= ", h(n, " | "))], " ")
  },
  EnumTypeDefinition: {
    leave: ({ name: e, directives: t, values: n }) => h(["enum", e, h(t, " "), H(n)], " ")
  },
  EnumValueDefinition: {
    leave: ({ name: e, directives: t }) => h([e, h(t, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ name: e, directives: t, fields: n }) => h(["input", e, h(t, " "), H(n)], " ")
  },
  DirectiveDefinition: {
    leave: ({ name: e, arguments: t, repeatable: n, locations: s }) => "directive @" + e + (fn(t) ? b(`(
`, qe(h(t, `
`)), `
)`) : b("(", h(t, ", "), ")")) + (n ? " repeatable" : "") + " on " + h(s, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => h(["extend schema", h(e, " "), H(t)], " ")
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => h(["extend scalar", e, h(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: s }) => h([
      "extend type",
      e,
      b("implements ", h(t, " & ")),
      h(n, " "),
      H(s)
    ], " ")
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: s }) => h([
      "extend interface",
      e,
      b("implements ", h(t, " & ")),
      h(n, " "),
      H(s)
    ], " ")
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => h(["extend union", e, h(t, " "), b("= ", h(n, " | "))], " ")
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => h(["extend enum", e, h(t, " "), H(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => h(["extend input", e, h(t, " "), H(n)], " ")
  }
}, Gr = Object.keys(hn).reduce((e, t) => ({
  ...e,
  [t]: {
    leave: Br(hn[t].leave)
  }
}), {});
function Jr(e) {
  return jn(e, Gr);
}
function Yr(e) {
  return e.kind === "FieldDefinition";
}
function Qr(e) {
  const t = Hr(e);
  if (t !== void 0)
    return Wr(`
${t}`);
}
function Hr(e) {
  const t = e.loc;
  if (!t)
    return;
  const n = [];
  let s = t.startToken.prev;
  for (; s != null && s.kind === p.COMMENT && s.next != null && s.prev != null && s.line + 1 === s.next.line && s.line !== s.prev.line; ) {
    const i = String(s.value);
    n.push(i), s = s.prev;
  }
  return n.length > 0 ? n.reverse().join(`
`) : void 0;
}
function Wr(e) {
  const t = e.split(/\r\n|[\n\r]/g), n = qr(t);
  if (n !== 0)
    for (let s = 1; s < t.length; s++)
      t[s] = t[s].slice(n);
  for (; t.length > 0 && mn(t[0]); )
    t.shift();
  for (; t.length > 0 && mn(t[t.length - 1]); )
    t.pop();
  return t.join(`
`);
}
function qr(e) {
  let t = null;
  for (let n = 1; n < e.length; n++) {
    const s = e[n], i = ps(s);
    if (i !== s.length && (t === null || i < t) && (t = i, t === 0))
      break;
  }
  return t === null ? 0 : t;
}
function ps(e) {
  let t = 0;
  for (; t < e.length && (e[t] === " " || e[t] === "	"); )
    t++;
  return t;
}
function mn(e) {
  return ps(e) === e.length;
}
function Kr(e) {
  return e && typeof e == "object" && "kind" in e && e.kind === c.DOCUMENT;
}
function zr(e, t, n) {
  const s = Xr([...t, ...e].filter(Ht), n);
  return n && n.sort && s.sort(yt), s;
}
function Xr(e, t) {
  return e.reduce((n, s) => {
    const i = n.findIndex((r) => r.name.value === s.name.value);
    return i === -1 ? n.concat([s]) : (t?.reverseArguments || (n[i] = s), n);
  }, []);
}
function Zr(e, t) {
  return !!e.find((n) => n.name.value === t.name.value);
}
function fs(e, t) {
  return !!t?.[e.name.value]?.repeatable;
}
function En(e, t) {
  return t.some(({ value: n }) => n === e.value);
}
function hs(e, t) {
  const n = [...t];
  for (const s of e) {
    const i = n.findIndex((r) => r.name.value === s.name.value);
    if (i > -1) {
      const r = n[i];
      if (r.value.kind === "ListValue") {
        const o = r.value.values, a = s.value.values;
        r.value.values = ms(o, a, (u, l) => {
          const d = u.value;
          return !d || !l.some((f) => f.value === d);
        });
      } else
        r.value = s.value;
    } else
      n.push(s);
  }
  return n;
}
function eo(e, t) {
  return e.map((n, s, i) => {
    const r = i.findIndex((o) => o.name.value === n.name.value);
    if (r !== s && !fs(n, t)) {
      const o = i[r];
      return n.arguments = hs(n.arguments, o.arguments), null;
    }
    return n;
  }).filter(Ht);
}
function ce(e = [], t = [], n, s) {
  const i = n && n.reverseDirectives, r = i ? e : t, o = i ? t : e, a = eo([...r], s);
  for (const u of o)
    if (Zr(a, u) && !fs(u, s)) {
      const l = a.findIndex((f) => f.name.value === u.name.value), d = a[l];
      a[l].arguments = hs(u.arguments || [], d.arguments || []);
    } else
      a.push(u);
  return a;
}
function to(e, t) {
  return t ? {
    ...e,
    arguments: ms(t.arguments || [], e.arguments || [], (n, s) => !En(n.name, s.map((i) => i.name))),
    locations: [
      ...t.locations,
      ...e.locations.filter((n) => !En(n, t.locations))
    ]
  } : e;
}
function ms(e, t, n) {
  return e.concat(t.filter((s) => n(s, e)));
}
function no(e, t, n, s) {
  if (n?.consistentEnumMerge) {
    const o = [];
    e && o.push(...e), e = t, t = o;
  }
  const i = /* @__PURE__ */ new Map();
  if (e)
    for (const o of e)
      i.set(o.name.value, o);
  if (t)
    for (const o of t) {
      const a = o.name.value;
      if (i.has(a)) {
        const u = i.get(a);
        u.description = o.description || u.description, u.directives = ce(o.directives, u.directives, s);
      } else
        i.set(a, o);
    }
  const r = [...i.values()];
  return n && n.sort && r.sort(yt), r;
}
function so(e, t, n, s) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    kind: n?.convertExtensions || e.kind === "EnumTypeDefinition" || t.kind === "EnumTypeDefinition" ? "EnumTypeDefinition" : "EnumTypeExtension",
    loc: e.loc,
    directives: ce(e.directives, t.directives, n, s),
    values: no(e.values, t.values, n)
  } : n?.convertExtensions ? {
    ...e,
    kind: c.ENUM_TYPE_DEFINITION
  } : e;
}
function io(e) {
  return typeof e == "string";
}
function ro(e) {
  return e instanceof Gt;
}
function vn(e) {
  let t = e;
  for (; t.kind === c.LIST_TYPE || t.kind === "NonNullType"; )
    t = t.type;
  return t;
}
function gn(e) {
  return e.kind !== c.NAMED_TYPE;
}
function Pt(e) {
  return e.kind === c.LIST_TYPE;
}
function me(e) {
  return e.kind === c.NON_NULL_TYPE;
}
function lt(e) {
  return Pt(e) ? `[${lt(e.type)}]` : me(e) ? `${lt(e.type)}!` : e.name.value;
}
var ue;
(function(e) {
  e[e.A_SMALLER_THAN_B = -1] = "A_SMALLER_THAN_B", e[e.A_EQUALS_B = 0] = "A_EQUALS_B", e[e.A_GREATER_THAN_B = 1] = "A_GREATER_THAN_B";
})(ue || (ue = {}));
function oo(e, t) {
  return e == null && t == null ? ue.A_EQUALS_B : e == null ? ue.A_SMALLER_THAN_B : t == null ? ue.A_GREATER_THAN_B : e < t ? ue.A_SMALLER_THAN_B : e > t ? ue.A_GREATER_THAN_B : ue.A_EQUALS_B;
}
function ao(e, t) {
  const n = e.findIndex((s) => s.name.value === t.name.value);
  return [n > -1 ? e[n] : null, n];
}
function Kt(e, t, n, s, i) {
  const r = [];
  if (n != null && r.push(...n), t != null)
    for (const o of t) {
      const [a, u] = ao(r, o);
      if (a && !s?.ignoreFieldConflicts) {
        const l = s?.onFieldTypeConflict && s.onFieldTypeConflict(a, o, e, s?.throwOnConflict) || co(e, a, o, s?.throwOnConflict);
        l.arguments = zr(o.arguments || [], a.arguments || [], s), l.directives = ce(o.directives, a.directives, s, i), l.description = o.description || a.description, r[u] = l;
      } else
        r.push(o);
    }
  if (s && s.sort && r.sort(yt), s && s.exclusions) {
    const o = s.exclusions;
    return r.filter((a) => !o.includes(`${e.name.value}.${a.name.value}`));
  }
  return r;
}
function co(e, t, n, s = !1) {
  const i = lt(t.type), r = lt(n.type);
  if (i !== r) {
    const o = vn(t.type), a = vn(n.type);
    if (o.name.value !== a.name.value)
      throw new Error(`Field "${n.name.value}" already defined with a different type. Declared as "${o.name.value}", but you tried to override with "${a.name.value}"`);
    if (!He(t.type, n.type, !s))
      throw new Error(`Field '${e.name.value}.${t.name.value}' changed type from '${i}' to '${r}'`);
  }
  return me(n.type) && !me(t.type) && (t.type = n.type), t;
}
function He(e, t, n = !1) {
  if (!gn(e) && !gn(t))
    return e.toString() === t.toString();
  if (me(t)) {
    const s = me(e) ? e.type : e;
    return He(s, t.type);
  }
  return me(e) ? He(t, e, n) : Pt(e) ? Pt(t) && He(e.type, t.type) || me(t) && He(e, t.type) : !1;
}
function uo(e, t, n, s) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n?.convertExtensions || e.kind === "InputObjectTypeDefinition" || t.kind === "InputObjectTypeDefinition" ? "InputObjectTypeDefinition" : "InputObjectTypeExtension",
        loc: e.loc,
        fields: Kt(e, e.fields, t.fields, n),
        directives: ce(e.directives, t.directives, n, s)
      };
    } catch (i) {
      throw new Error(`Unable to merge GraphQL input type "${e.name.value}": ${i.message}`);
    }
  return n?.convertExtensions ? {
    ...e,
    kind: c.INPUT_OBJECT_TYPE_DEFINITION
  } : e;
}
function lo(e, t) {
  return !!e.find((n) => n.name.value === t.name.value);
}
function zt(e = [], t = [], n = {}) {
  const s = [...t, ...e.filter((i) => !lo(t, i))];
  return n && n.sort && s.sort(yt), s;
}
function po(e, t, n, s) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n?.convertExtensions || e.kind === "InterfaceTypeDefinition" || t.kind === "InterfaceTypeDefinition" ? "InterfaceTypeDefinition" : "InterfaceTypeExtension",
        loc: e.loc,
        fields: Kt(e, e.fields, t.fields, n),
        directives: ce(e.directives, t.directives, n, s),
        interfaces: e.interfaces ? zt(e.interfaces, t.interfaces, n) : void 0
      };
    } catch (i) {
      throw new Error(`Unable to merge GraphQL interface "${e.name.value}": ${i.message}`);
    }
  return n?.convertExtensions ? {
    ...e,
    kind: c.INTERFACE_TYPE_DEFINITION
  } : e;
}
var z = {};
Object.defineProperty(z, "__esModule", {
  value: !0
});
z.Token = z.QueryDocumentKeys = z.OperationTypeNode = z.Location = void 0;
var fo = z.isNode = vo;
class ho {
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
  constructor(t, n, s) {
    this.start = t.start, this.end = n.end, this.startToken = t, this.endToken = n, this.source = s;
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
z.Location = ho;
class mo {
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
  constructor(t, n, s, i, r, o) {
    this.kind = t, this.start = n, this.end = s, this.line = i, this.column = r, this.value = o, this.prev = null, this.next = null;
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
z.Token = mo;
const Es = {
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
z.QueryDocumentKeys = Es;
const Eo = new Set(Object.keys(Es));
function vo(e) {
  const t = e?.kind;
  return typeof t == "string" && Eo.has(t);
}
var Ft;
z.OperationTypeNode = Ft;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(Ft || (z.OperationTypeNode = Ft = {}));
function go(e, t, n, s) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    kind: n?.convertExtensions || e.kind === "ScalarTypeDefinition" || t.kind === "ScalarTypeDefinition" ? "ScalarTypeDefinition" : "ScalarTypeExtension",
    loc: e.loc,
    directives: ce(e.directives, t.directives, n, s)
  } : n?.convertExtensions ? {
    ...e,
    kind: c.SCALAR_TYPE_DEFINITION
  } : e;
}
const Vt = {
  query: "Query",
  mutation: "Mutation",
  subscription: "Subscription"
};
function yo(e = [], t = []) {
  const n = [];
  for (const s in Vt) {
    const i = e.find((r) => r.operation === s) || t.find((r) => r.operation === s);
    i && n.push(i);
  }
  return n;
}
function To(e, t, n, s) {
  return t ? {
    kind: e.kind === c.SCHEMA_DEFINITION || t.kind === c.SCHEMA_DEFINITION ? c.SCHEMA_DEFINITION : c.SCHEMA_EXTENSION,
    description: e.description || t.description,
    directives: ce(e.directives, t.directives, n, s),
    operationTypes: yo(e.operationTypes, t.operationTypes)
  } : n?.convertExtensions ? {
    ...e,
    kind: c.SCHEMA_DEFINITION
  } : e;
}
function Io(e, t, n, s) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n?.convertExtensions || e.kind === "ObjectTypeDefinition" || t.kind === "ObjectTypeDefinition" ? "ObjectTypeDefinition" : "ObjectTypeExtension",
        loc: e.loc,
        fields: Kt(e, e.fields, t.fields, n),
        directives: ce(e.directives, t.directives, n, s),
        interfaces: zt(e.interfaces, t.interfaces, n)
      };
    } catch (i) {
      throw new Error(`Unable to merge GraphQL type "${e.name.value}": ${i.message}`);
    }
  return n?.convertExtensions ? {
    ...e,
    kind: c.OBJECT_TYPE_DEFINITION
  } : e;
}
function No(e, t, n, s) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ce(e.directives, t.directives, n, s),
    kind: n?.convertExtensions || e.kind === "UnionTypeDefinition" || t.kind === "UnionTypeDefinition" ? c.UNION_TYPE_DEFINITION : c.UNION_TYPE_EXTENSION,
    loc: e.loc,
    types: zt(e.types, t.types, n)
  } : n?.convertExtensions ? {
    ...e,
    kind: c.UNION_TYPE_DEFINITION
  } : e;
}
const be = "SCHEMA_DEF_SYMBOL";
function So(e) {
  return "name" in e;
}
function yn(e, t, n = {}) {
  const s = n;
  for (const i of e)
    if (So(i)) {
      const r = i.name?.value;
      if (t?.commentDescriptions && Mr(i), r == null)
        continue;
      if (t?.exclusions?.includes(r + ".*") || t?.exclusions?.includes(r))
        delete s[r];
      else
        switch (i.kind) {
          case c.OBJECT_TYPE_DEFINITION:
          case c.OBJECT_TYPE_EXTENSION:
            s[r] = Io(i, s[r], t, n);
            break;
          case c.ENUM_TYPE_DEFINITION:
          case c.ENUM_TYPE_EXTENSION:
            s[r] = so(i, s[r], t, n);
            break;
          case c.UNION_TYPE_DEFINITION:
          case c.UNION_TYPE_EXTENSION:
            s[r] = No(i, s[r], t, n);
            break;
          case c.SCALAR_TYPE_DEFINITION:
          case c.SCALAR_TYPE_EXTENSION:
            s[r] = go(i, s[r], t, n);
            break;
          case c.INPUT_OBJECT_TYPE_DEFINITION:
          case c.INPUT_OBJECT_TYPE_EXTENSION:
            s[r] = uo(i, s[r], t, n);
            break;
          case c.INTERFACE_TYPE_DEFINITION:
          case c.INTERFACE_TYPE_EXTENSION:
            s[r] = po(i, s[r], t, n);
            break;
          case c.DIRECTIVE_DEFINITION:
            s[r] && r in {} && (fo(s[r]) || (s[r] = void 0)), s[r] = to(i, s[r]);
            break;
        }
    } else
      (i.kind === c.SCHEMA_DEFINITION || i.kind === c.SCHEMA_EXTENSION) && (s[be] = To(i, s[be], t));
  return s;
}
function Oo(e, t) {
  Ut();
  const n = {
    kind: c.DOCUMENT,
    definitions: wo(e, {
      useSchemaDefinition: !0,
      forceSchemaDefinition: !1,
      throwOnConflict: !1,
      commentDescriptions: !1,
      ...t
    })
  };
  let s;
  return t?.commentDescriptions ? s = Jr(n) : s = n, Ut(), s;
}
function Ae(e, t, n = [], s = [], i = /* @__PURE__ */ new Set()) {
  if (e && !i.has(e))
    if (i.add(e), typeof e == "function")
      Ae(e(), t, n, s, i);
    else if (Array.isArray(e))
      for (const r of e)
        Ae(r, t, n, s, i);
    else if (zi(e)) {
      const r = _r(e, t);
      Ae(r.definitions, t, n, s, i);
    } else if (io(e) || ro(e)) {
      const r = $n(e, t);
      Ae(r.definitions, t, n, s, i);
    } else if (typeof e == "object" && Zi(e))
      e.kind === c.DIRECTIVE_DEFINITION ? n.push(e) : s.push(e);
    else if (Kr(e))
      Ae(e.definitions, t, n, s, i);
    else
      throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof e}`);
  return { allDirectives: n, allNodes: s };
}
function wo(e, t) {
  Ut();
  const { allDirectives: n, allNodes: s } = Ae(e, t), i = yn(n, t), r = yn(s, t, i);
  if (t?.useSchemaDefinition) {
    const a = r[be] || {
      kind: c.SCHEMA_DEFINITION,
      operationTypes: []
    }, u = a.operationTypes;
    for (const l in Vt)
      if (!u.find((d) => d.operation === l)) {
        const d = Vt[l], f = r[d];
        f != null && f.name != null && u.push({
          kind: c.OPERATION_TYPE_DEFINITION,
          type: {
            kind: c.NAMED_TYPE,
            name: f.name
          },
          operation: l
        });
      }
    a?.operationTypes?.length != null && a.operationTypes.length > 0 && (r[be] = a);
  }
  t?.forceSchemaDefinition && !r[be]?.operationTypes?.length && (r[be] = {
    kind: c.SCHEMA_DEFINITION,
    operationTypes: [
      {
        kind: c.OPERATION_TYPE_DEFINITION,
        operation: "query",
        type: {
          kind: c.NAMED_TYPE,
          name: {
            kind: c.NAME,
            value: "Query"
          }
        }
      }
    ]
  });
  const o = Object.values(r);
  if (t?.sort) {
    const a = typeof t.sort == "function" ? t.sort : oo;
    o.sort((u, l) => a(u.name?.value, l.name?.value));
  }
  return o;
}
const _o = oe`
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
`, Ze = (e, t) => (e === void 0 && (e = {}), e._default === void 0 && (e._default = {}), typeof e._default == "object" && (e._default.request = new _s(
  t
)), e);
class G extends Rs {
  static defaultMaxAgeInSeconds = void 0;
  static key = "profileValidation";
  constructor() {
    super("profileValidation");
  }
  addToPayload_internal(t, n, s) {
    return {
      ...t,
      [this.key]: {
        v: n,
        t: Date.now()
      }
    };
  }
  fetchValue = async (t, n) => {
    const s = Mt(n)?.original;
    if (!s)
      throw new Error("Request not set in userContext");
    const i = s.config.user?.features?.profileValidation;
    if (!i?.enabled)
      throw new Error("Profile validation is not enabled");
    const r = s?.user;
    if (!r)
      throw new Error("User not found");
    const a = !(i.fields || []).some((l) => r[l] === null);
    return {
      gracePeriodEndsAt: !a && i.gracePeriodInDays ? r.signedUpAt + i.gracePeriodInDays * (24 * 60 * 60 * 1e3) : void 0,
      isVerified: a
    };
  };
  getLastRefetchTime(t, n) {
    return t[this.key]?.t;
  }
  getValueFromPayload(t, n) {
    return t[this.key]?.v;
  }
  removeFromPayload(t, n) {
    const s = {
      ...t
    };
    return delete s[this.key], s;
  }
  removeFromPayloadByMerge_internal(t, n) {
    return {
      ...t,
      [this.key]: null
    };
  }
  validators = {
    isVerified: (t = G.defaultMaxAgeInSeconds, n) => ({
      claim: this,
      id: n ?? this.key,
      shouldRefetch: () => !0,
      validate: async (s, i) => {
        const o = this.getValueFromPayload(s, i);
        return o === void 0 ? {
          isValid: !1,
          reason: {
            message: "value does not exist",
            expectedValue: !0,
            actualValue: void 0
          }
        } : o.isVerified !== !0 && (!o.gracePeriodEndsAt || o.gracePeriodEndsAt <= Date.now()) ? {
          isValid: !1,
          reason: {
            message: "User profile is incomplete",
            expectedValue: !0,
            actualValue: o.isVerified
          }
        } : { isValid: !0 };
      }
    })
  };
}
const Ro = Ue(async (e) => {
  await e.register(Sn, {
    async applyPolicy(t, n, s, i) {
      if (!i.user)
        return new g.ErrorWithProps("unauthorized", {}, 401);
      if (i.user.disabled)
        return new g.ErrorWithProps("user is disabled", {}, 401);
      if (e.config.user.features?.signUp?.emailVerification && !await ve.isEmailVerified(i.user.id))
        return new g.ErrorWithProps(
          "invalid claim",
          {
            claimValidationErrors: [
              {
                id: "st-ev",
                reason: {
                  message: "wrong value",
                  expectedValue: !0,
                  actualValue: !1
                }
              }
            ]
          },
          403
        );
      if (e.config.user.features?.profileValidation?.enabled && t.arguments.find(
        (o) => o?.name?.value === "profileValidation"
      )?.value?.value != !1) {
        const o = i.reply.request, a = new G(), u = Ze(
          void 0,
          i.reply.request
        );
        await o.session?.fetchAndSetClaim(
          a,
          u
        );
        try {
          await o.session?.assertClaims(
            [a.validators.isVerified()],
            u
          );
        } catch (l) {
          if (l instanceof At)
            return new g.ErrorWithProps(
              "invalid claim",
              {
                claimValidationErrors: l.payload
              },
              403
            );
          throw l;
        }
      }
      return !0;
    },
    authDirective: "auth"
  });
}), Ao = "/signup/token/:token", bo = 30, ko = "/invitations", Do = "/invitations/token/:token", xo = "/invitations", Lo = "/invitations/:id(^\\d+)", Co = "/invitations/token/:token", Uo = "/invitations/resend/:id(^\\d+)", Po = "/invitations/revoke/:id(^\\d+)", Fo = "invitations", Vo = "/reset-password", Ce = "ADMIN", Ne = "SUPERADMIN", Nt = "USER", Mo = "/change_password", Tn = "/signup/admin", In = "/me", $o = "/users", Bo = "/users/:id", jo = "/users/:id/disable", Go = "/users/:id/enable", vs = "users", _t = "/roles", Nn = "/roles/permissions", Jo = "/permissions", Yo = "REQUIRED", Qo = "/verify-email", Ho = "invitations:create", Wo = "invitations:delete", qo = "invitations:list", Ko = "invitations:resend", zo = "invitations:revoke", Xo = "users:disable", Zo = "users:enable", ea = "users:list", ta = "users:read", na = async (e) => {
  let t = [];
  for (const n of e) {
    const s = await R.getPermissionsForRole(n);
    s.status === "OK" && (t = [.../* @__PURE__ */ new Set([...t, ...s.permissions])]);
  }
  return t;
}, gs = async (e, t, n) => {
  const s = e.config.user.permissions;
  if (!s || !s.includes(n))
    return !0;
  const { roles: i } = await R.getRolesForUser(t);
  if (i && i.includes(Ne))
    return !0;
  const r = await na(i);
  return !(!r || !r.includes(n));
}, sa = Ue(async (e) => {
  await e.register(Sn, {
    applyPolicy: async (t, n, s, i) => {
      const r = t.arguments.find(
        (a) => a.name.value === "permission"
      ).value.value;
      return i.user ? await gs(
        i.app,
        i.user?.id,
        r
      ) ? !0 : new g.ErrorWithProps(
        "invalid claim",
        {
          claimValidationErrors: [
            {
              id: "st-perm",
              reason: {
                message: "Not have enough permission",
                expectedToInclude: r
              }
            }
          ]
        },
        403
      ) : new g.ErrorWithProps("unauthorized", {}, 401);
    },
    authDirective: "hasPermission"
  });
}), ia = Ue(async (e) => {
  e.config?.graphql?.enabled && (await e.register(sa), await e.register(Ro));
}), ra = (e) => async (t) => {
  const n = t.session?.getUserId();
  if (!n)
    throw new At({
      type: "UNAUTHORISED",
      message: "unauthorised"
    });
  if (!await gs(t.server, n, e))
    throw new At({
      type: "INVALID_CLAIMS",
      message: "Not have enough permission",
      payload: [
        {
          id: R.PermissionClaim.key,
          reason: {
            message: "Not have enough permission",
            expectedToInclude: e
          }
        }
      ]
    });
}, Xt = (e) => {
  let t;
  try {
    if (t = new URL(e).origin, !t || t === "null")
      throw new Error("Origin is empty");
  } catch {
    t = "";
  }
  return t;
}, et = async ({
  fastify: e,
  subject: t,
  templateData: n = {},
  templateName: s,
  to: i
}) => {
  const { config: r, log: o, mailer: a } = e;
  return a.sendMail({
    subject: t,
    templateName: s,
    to: i,
    templateData: {
      appName: r.appName,
      ...n
    }
  }).catch((u) => {
    o.error(u.stack);
  });
}, oa = (e, t) => {
  const n = t.config.appOrigin[0];
  return async (s) => {
    let i;
    try {
      const o = s.userContext._default.request.request, a = o.headers.referer || o.headers.origin || o.hostname;
      i = Xt(a) || n;
    } catch {
      i = n;
    }
    const r = s.emailVerifyLink.replace(
      n + "/auth/verify-email",
      i + (t.config.user.supertokens.emailVerificationPath || Qo)
    );
    et({
      fastify: t,
      subject: "Email Verification",
      templateName: "email-verification",
      to: s.user.email,
      templateData: {
        emailVerifyLink: r
      }
    });
  };
}, aa = (e) => {
  const { config: t } = e;
  let n = {};
  return typeof t.user.supertokens.recipes?.emailVerification == "object" && (n = t.user.supertokens.recipes.emailVerification), {
    mode: n?.mode || Yo,
    emailDelivery: {
      override: (s) => {
        let i;
        return n?.sendEmail && (i = n.sendEmail), {
          ...s,
          sendEmail: i ? i(s, e) : oa(s, e)
        };
      }
    },
    override: {
      apis: (s) => {
        const i = {};
        if (n.override?.apis) {
          const r = n.override.apis;
          let o;
          for (o in r) {
            const a = r[o];
            a && (i[o] = a(
              s,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          verifyEmailPOST: async (r) => {
            if (s.verifyEmailPOST === void 0)
              throw new Error("Should never come here");
            return r.session ? await s.verifyEmailPOST(
              r
            ) : {
              status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR"
            };
          },
          ...i
        };
      },
      functions: (s) => {
        const i = {};
        if (n.override?.functions) {
          const r = n.override.functions;
          let o;
          for (o in r) {
            const a = r[o];
            a && (i[o] = a(
              s,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          ...i
        };
      }
    }
  };
}, ca = (e) => {
  const t = e.config.user.supertokens.recipes?.emailVerification;
  return typeof t == "function" ? ve.init(t(e)) : ve.init(aa(e));
}, ua = (e, t) => {
  if (t && t.length > 0) {
    const n = [];
    for (const s of t) {
      const i = s.direction === "ASC" ? A.fragment`ASC` : A.fragment`DESC`;
      let r;
      s.key === "roles" && (r = A.fragment`user_role.role ->> 0`);
      const o = A.identifier([
        ...e.names,
        $t.decamelize(s.key)
      ]);
      n.push(
        A.fragment`${r ?? o} ${i}`
      );
    }
    return A.fragment`ORDER BY ${A.join(n, A.fragment`,`)}`;
  }
  return A.fragment``;
}, Rt = (e, t) => {
  let n = A.fragment`ASC`;
  return Array.isArray(t) || (t = []), t.some((s) => s.key === "roles" && s.direction != "ASC" ? (n = A.fragment`DESC`, !0) : !1), A.fragment`ORDER BY ${e} ${n}`;
};
class la extends wn {
  /* eslint-enabled */
  getFindByIdSql = (t) => A.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${Rt(
    A.identifier(["ur", "role"])
  )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      WHERE id = ${t};
    `;
  getListSql = (t, n, s, i) => {
    const r = _n(this.table, this.schema);
    return A.type(this.validationSchema)`
      SELECT
        ${this.getTableFragment()}.*,
        COALESCE(user_role.role, '[]') AS roles
      FROM ${this.getTableFragment()}
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(ur.role ${Rt(
      A.identifier(["ur", "role"]),
      i
    )}) AS role
        FROM "public"."st__user_roles" as ur
        WHERE ur.user_id = users.id
      ) AS user_role ON TRUE
      ${Rn(s, r)}
      ${ua(r, this.getSortInput(i))}
      ${An(t, n)};
    `;
  };
  getUpdateSql = (t, n) => {
    const s = [];
    for (const i in n) {
      const r = n[i];
      s.push(
        A.fragment`${A.identifier([$t.decamelize(i)])} = ${r}`
      );
    }
    return A.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${A.join(s, A.fragment`, `)}
      WHERE id = ${t}
      RETURNING *, (
        SELECT COALESCE(user_role.role, '[]') AS roles
        FROM ${this.getTableFragment()}
        LEFT JOIN LATERAL (
          SELECT jsonb_agg(ur.role ${Rt(
      A.identifier(["ur", "role"])
    )}) AS role
          FROM "public"."st__user_roles" as ur
          WHERE ur.user_id = users.id
        ) AS user_role ON TRUE
        WHERE id = ${t}
      ) as roles;
    `;
  };
}
const da = (e, t) => Dn.string({
  required_error: e.required
}).refine((n) => kn.isEmail(n, t || {}), {
  message: e.invalid
}), ys = {
  minLength: 8,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
  returnScore: !1,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10
}, pa = (e, t) => {
  const n = {
    ...ys,
    ...t
  };
  return Dn.string({
    required_error: e.required
  }).refine(
    (s) => kn.isStrongPassword(
      s,
      n
    ),
    {
      message: e.weak
    }
  );
}, fa = (e) => {
  let t = "Password is too weak";
  if (!e)
    return t;
  const n = [];
  if (e.minLength) {
    const s = e.minLength;
    n.push(
      `minimum ${s} ${s > 1 ? "characters" : "character"}`
    );
  }
  if (e.minLowercase) {
    const s = e.minLowercase;
    n.push(
      `minimum ${s} ${s > 1 ? "lowercases" : "lowercase"}`
    );
  }
  if (e.minUppercase) {
    const s = e.minUppercase;
    n.push(
      `minimum ${s} ${s > 1 ? "uppercases" : "uppercase"}`
    );
  }
  if (e.minNumbers) {
    const s = e.minNumbers;
    n.push(`minimum ${s} ${s > 1 ? "numbers" : "number"}`);
  }
  if (e.minSymbols) {
    const s = e.minSymbols;
    n.push(`minimum ${s} ${s > 1 ? "symbols" : "symbol"}`);
  }
  if (n.length > 0) {
    t = "Password should contain ";
    const s = n.pop();
    n.length > 0 && (t += n.join(", ") + " and "), t += s;
  }
  return t;
}, Be = (e, t) => {
  const n = t.user.password, s = pa(
    {
      required: "Password is required",
      weak: fa({ ...ys, ...n })
    },
    n
  ).safeParse(e);
  return s.success ? { success: !0 } : {
    message: s.error.issues[0].message,
    success: !1
  };
};
class ha extends bn {
  changePassword = async (t, n, s) => {
    const i = Be(s, this.config);
    if (!i.success)
      return {
        status: "FIELD_ERROR",
        message: i.message
      };
    const r = await ke.getUserById(t);
    if (n && s)
      if (r)
        if ((await ke.emailPasswordSignIn(
          r.email,
          n,
          { dbSchema: this.schema }
        )).status === "OK") {
          if (await ke.updateEmailOrPassword({
            userId: t,
            password: s
          }))
            return await Ke.revokeAllSessionsForUser(t), {
              status: "OK"
            };
          throw {
            status: "FAILED",
            message: "Oops! Something went wrong, couldn't change password"
          };
        } else
          return {
            status: "INVALID_PASSWORD",
            message: "Invalid password"
          };
      else
        throw {
          status: "NOT_FOUND",
          message: "User not found"
        };
    else
      return {
        status: "FIELD_ERROR",
        message: "Password cannot be empty"
      };
  };
  get table() {
    return this.config.user?.table?.name || vs;
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new la(this)), this._factory;
  }
}
const U = (e, t, n) => {
  const s = e.user.services?.user || ha;
  return new s(
    e,
    t,
    n
  );
}, ma = (e, t) => async (n) => {
  if (e.createNewSession === void 0)
    throw new Error("Should never come here");
  const s = Mt(n.userContext)?.original;
  if (s) {
    const { config: r, dbSchema: o, slonik: a } = s, l = await U(r, a, o).findById(n.userId) || void 0;
    if (l?.disabled)
      throw {
        name: "SIGN_IN_FAILED",
        message: "user is disabled",
        statusCode: 401
      };
    s.user = l;
  }
  const i = await e.createNewSession(n);
  return s?.user && s?.config.user.features?.profileValidation?.enabled && await i.fetchAndSetClaim(
    new G(),
    n.userContext
  ), i;
}, Ea = (e, t) => async (n) => {
  if (e.getGlobalClaimValidators === void 0)
    throw new Error("Should never come here");
  const s = Mt(n.userContext)?.original;
  return s && s.config.user.features?.profileValidation?.enabled ? [
    ...n.claimValidatorsAddedByOtherRecipes,
    new G().validators.isVerified()
  ] : n.claimValidatorsAddedByOtherRecipes;
}, va = (e, t) => async (n) => {
  if (e.getSession === void 0)
    throw new Error("Should never come here");
  const { config: s, dbSchema: i, slonik: r } = n.userContext._default.request.request;
  n.options = {
    checkDatabase: s.user.supertokens.checkSessionInDatabase ?? !0,
    ...n.options
  };
  const o = await e.getSession(n);
  if (o) {
    const a = o.getUserId(), l = await U(s, r, i).findById(a) || void 0;
    n.userContext._default.request.request.user = l;
  }
  return o;
}, ga = (e, t) => async (n) => {
  if (e.verifySession === void 0)
    throw new Error("Should never come here");
  n.verifySessionOptions = {
    checkDatabase: t.config.user.supertokens.checkSessionInDatabase ?? !0,
    ...n.verifySessionOptions
  };
  const s = await e.verifySession(n);
  if (s && n.userContext._default.request.request.user?.disabled)
    throw await s.revokeSession(), {
      name: "SESSION_VERIFICATION_FAILED",
      message: "user is disabled",
      statusCode: 401
    };
  return s;
}, ya = (e) => {
  const { config: t } = e;
  let n = {};
  return typeof t.user.supertokens.recipes?.session == "object" && (n = t.user.supertokens.recipes.session), {
    ...n,
    getTokenTransferMethod: (s) => s.req.getHeaderValue("st-auth-mode") === "header" ? "header" : "cookie",
    override: {
      apis: (s) => {
        const i = {};
        if (n.override?.apis) {
          const r = n.override.apis;
          let o;
          for (o in r) {
            const a = r[o];
            a && (i[o] = a(
              s,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          verifySession: ga(s, e),
          ...i
        };
      },
      functions: (s) => {
        const i = {};
        if (n.override?.functions) {
          const r = n.override.functions;
          let o;
          for (o in r) {
            const a = r[o];
            a && (i[o] = a(
              s,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          createNewSession: ma(s),
          ...i,
          getSession: va(s),
          getGlobalClaimValidators: Ea(
            s
          )
        };
      },
      openIdFeature: n.override?.openIdFeature
    }
  };
}, Ta = (e) => {
  const t = e.config.user.supertokens.recipes?.session;
  return typeof t == "function" ? Ke.init(t(e)) : Ke.init(ya(e));
}, Ia = (e, t) => async (n) => {
  if (e.appleRedirectHandlerPOST === void 0)
    throw new Error("Should never come here");
  const s = n.state, i = JSON.parse(
    Buffer.from(s, "base64").toString("ascii")
  );
  if (i.isAndroid && i.appId) {
    const o = `intent://callback?${`code=${n.code}&state=${n.state}`}#Intent;package=${i.appId};scheme=signinwithapple;end`;
    n.options.res.original.redirect(o);
  } else
    e.appleRedirectHandlerPOST(n);
}, Na = (e, t) => {
  const { config: n, log: s, slonik: i } = t;
  return async (r) => {
    const o = await e.emailPasswordSignIn(
      r
    );
    if (o.status !== "OK")
      return o;
    const a = U(n, i), u = await a.findById(o.user.id);
    return u ? (u.lastLoginAt = Date.now(), await a.update(u.id, {
      lastLoginAt: de(new Date(u.lastLoginAt))
    }).catch((d) => {
      s.error(
        `Unable to update lastLoginAt for userId ${o.user.id}`
      ), s.error(d);
    }), {
      status: "OK",
      user: {
        ...o.user,
        ...u
      }
    }) : (s.error(`User record not found for userId ${o.user.id}`), { status: "WRONG_CREDENTIALS_ERROR" });
  };
}, Sa = async (e) => {
  const t = await ve.createEmailVerificationToken(
    e
  );
  t.status === "OK" && await ve.verifyEmailUsingToken(t.token);
}, Ts = async (e) => {
  const { roles: t } = await R.getAllRoles();
  return e.every((n) => t.includes(n));
}, Oa = (e, t) => {
  const { config: n, log: s, slonik: i } = t;
  return async (r) => {
    const o = r.userContext.roles || [];
    if (!await Ts(o))
      throw s.error(`At least one role from ${o.join(", ")} does not exist.`), {
        name: "SIGN_UP_FAILED",
        message: "Something went wrong",
        statusCode: 500
      };
    const a = await e.emailPasswordSignUp(
      r
    );
    if (a.status === "OK") {
      const u = U(n, i);
      let l;
      try {
        if (l = await u.create({
          id: a.user.id,
          email: a.user.email
        }), !l)
          throw new Error("User not found");
      } catch (d) {
        throw s.error("Error while creating user"), s.error(d), await bt(a.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
      l.roles = o, a.user = {
        ...a.user,
        ...l
      };
      for (const d of o) {
        const f = await R.addRoleToUser(
          a.user.id,
          d
        );
        f.status !== "OK" && s.error(f.status);
      }
      if (n.user.features?.signUp?.emailVerification)
        try {
          if (r.userContext.autoVerifyEmail)
            await Sa(l.id);
          else {
            const d = await ve.createEmailVerificationToken(
              a.user.id
            );
            d.status === "OK" && await ve.sendEmail({
              type: "EMAIL_VERIFICATION",
              user: a.user,
              emailVerifyLink: `${n.appOrigin[0]}/auth/verify-email?token=${d.token}&rid=emailverification`,
              userContext: r.userContext
            });
          }
        } catch (d) {
          s.error(d);
        }
    }
    if (n.user.supertokens.sendUserAlreadyExistsWarning && a.status === "EMAIL_ALREADY_EXISTS_ERROR")
      try {
        et({
          fastify: t,
          subject: "Duplicate Email Registration",
          templateData: {
            emailId: r.email
          },
          templateName: "duplicate-email-warning",
          to: r.email
        });
      } catch (u) {
        s.error(u);
      }
    return a;
  };
}, wa = (e, t) => async (n) => {
  if (n.userContext.roles = [t.config.user.role || Nt], e.emailPasswordSignUpPOST === void 0)
    throw new Error("Should never come here");
  if (t.config.user.features?.signUp?.enabled === !1)
    throw {
      name: "SIGN_UP_DISABLED",
      message: "SignUp feature is currently disabled",
      statusCode: 404
    };
  const s = await e.emailPasswordSignUpPOST(n);
  return s.status === "OK" ? {
    status: "OK",
    user: s.user,
    session: s.session
  } : s;
}, Se = (e, t) => {
  const n = da(
    {
      invalid: "Email is invalid",
      required: "Email is required"
    },
    t.user.email
  ).safeParse(e);
  return n.success ? { success: !0 } : {
    message: n.error.issues[0].message,
    success: !1
  };
}, _a = (e) => [
  {
    id: "email",
    validate: async (t) => {
      const n = Se(t, e);
      if (!n.success)
        return n.message;
    }
  },
  {
    id: "password",
    validate: async (t) => {
      const n = Be(t, e);
      if (!n.success)
        return n.message;
    }
  }
], Ra = (e) => {
  let t = [];
  if (typeof e.user.supertokens?.recipes?.thirdPartyEmailPassword == "object") {
    const s = e.user.supertokens?.recipes?.thirdPartyEmailPassword.signUpFeature?.formFields;
    s && (t = [...s]);
  }
  const n = new Set(t.map((s) => s.id));
  for (const s of _a(e))
    n.has(s.id) || t.push(s);
  return t;
}, Aa = (e, t) => async (n) => {
  const s = await e.resetPasswordUsingToken(n);
  if (s.status === "OK" && s.userId) {
    const i = await Ps(s.userId);
    i && et({
      fastify: t,
      subject: "Reset Password Notification",
      templateName: "reset-password-notification",
      to: i.email,
      templateData: {
        emailId: i.email
      }
    });
  }
  return s;
}, ba = (e, t) => {
  const n = t.config.appOrigin[0];
  return async (s) => {
    const i = s.userContext._default.request.request;
    let r;
    if (i.query.appId) {
      const l = Number(i.query.appId);
      r = t.config.apps?.find((d) => d.id === l);
    }
    const o = r?.origin || i.headers.referer || i.headers.origin || i.hostname, a = Xt(o) || n, u = s.passwordResetLink.replace(
      n + "/auth/reset-password",
      a + (t.config.user.supertokens.resetPasswordPath || Vo)
    );
    et({
      fastify: t,
      subject: "Reset Password",
      templateName: "reset-password",
      to: s.user.email,
      templateData: {
        passwordResetLink: u
      }
    });
  };
}, ka = (e, t) => {
  const { config: n, log: s, slonik: i } = t;
  return async (r) => {
    const o = r.userContext.roles || [];
    if (!await Fs(
      r.thirdPartyId,
      r.thirdPartyUserId,
      r.userContext
    ) && n.user.features?.signUp?.enabled === !1)
      throw {
        name: "SIGN_UP_DISABLED",
        message: "SignUp feature is currently disabled",
        statusCode: 404
      };
    const u = await e.thirdPartySignInUp(
      r
    ), l = U(
      n,
      i,
      r.userContext._default.request.request.dbSchema
    );
    if (u.createdNewUser) {
      if (!await Ts(o))
        throw await bt(u.user.id), s.error(`At least one role from ${o.join(", ")} does not exist.`), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      for (const f of o) {
        const E = await R.addRoleToUser(
          u.user.id,
          f
        );
        E.status !== "OK" && s.error(E.status);
      }
      let d;
      try {
        if (d = await l.create({
          id: u.user.id,
          email: u.user.email
        }), !d)
          throw new Error("User not found");
      } catch (f) {
        throw s.error("Error while creating user"), s.error(f), await bt(u.user.id), {
          name: "SIGN_UP_FAILED",
          message: "Something went wrong",
          statusCode: 500
        };
      }
    } else
      await l.update(u.user.id, {
        lastLoginAt: de(new Date(Date.now()))
      }).catch((d) => {
        s.error(
          `Unable to update lastLoginAt for userId ${u.user.id}`
        ), s.error(d);
      });
    return u;
  };
}, Da = (e, t) => {
  const { config: n, log: s, slonik: i } = t;
  return async (r) => {
    if (r.userContext.roles = [n.user.role || Nt], e.thirdPartySignInUpPOST === void 0)
      throw new Error("Should never come here");
    const o = await e.thirdPartySignInUpPOST(r);
    if (o.status === "OK") {
      const u = await U(
        n,
        i,
        r.userContext._default.request.request.dbSchema
      ).findById(o.user.id);
      return u ? {
        ...o,
        user: {
          ...o.user,
          ...u
        }
      } : (s.error(
        `User record not found for userId ${o.user.id}`
      ), {
        status: "GENERAL_ERROR",
        message: "Something went wrong"
      });
    }
    return o;
  };
}, xa = (e) => {
  const { Apple: t, Facebook: n, Github: s, Google: i } = ke, r = e.user.supertokens.providers, o = [], a = [
    { name: "google", initProvider: i },
    { name: "github", initProvider: s },
    { name: "facebook", initProvider: n },
    { name: "apple", initProvider: t }
  ];
  for (const l of a)
    if (r?.[l.name])
      if (l.name === "apple") {
        const d = r[l.name];
        if (d)
          for (const f of d)
            o.push(l.initProvider(f));
      } else
        o.push(
          l.initProvider(
            r[l.name]
          )
        );
  const u = r?.custom;
  if (u)
    for (const l of u)
      o.push(l);
  return o;
}, La = (e) => {
  const { config: t } = e;
  let n = {};
  return typeof t.user.supertokens.recipes?.thirdPartyEmailPassword == "object" && (n = t.user.supertokens.recipes.thirdPartyEmailPassword), {
    override: {
      apis: (s) => {
        const i = {};
        if (n.override?.apis) {
          const r = n.override.apis;
          let o;
          for (o in r) {
            const a = r[o];
            a && (i[o] = a(
              s,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          emailPasswordSignUpPOST: wa(
            s,
            e
          ),
          thirdPartySignInUpPOST: Da(
            s,
            e
          ),
          appleRedirectHandlerPOST: Ia(
            s
          ),
          ...i
        };
      },
      functions: (s) => {
        const i = {};
        if (n.override?.functions) {
          const r = n.override.functions;
          let o;
          for (o in r) {
            const a = r[o];
            a && (i[o] = a(
              s,
              e
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ));
          }
        }
        return {
          ...s,
          emailPasswordSignIn: Na(
            s,
            e
          ),
          emailPasswordSignUp: Oa(
            s,
            e
          ),
          resetPasswordUsingToken: Aa(
            s,
            e
          ),
          thirdPartySignInUp: ka(
            s,
            e
          ),
          ...i
        };
      }
    },
    signUpFeature: {
      formFields: Ra(t)
    },
    emailDelivery: {
      override: (s) => {
        let i;
        return n?.sendEmail && (i = n.sendEmail), {
          ...s,
          sendEmail: i ? i(s, e) : ba(s, e)
        };
      }
    },
    providers: xa(t)
  };
}, Ca = (e) => {
  const t = e.config.user.supertokens.recipes?.thirdPartyEmailPassword;
  return typeof t == "function" ? ke.init(t(e)) : ke.init(
    La(e)
  );
}, Ua = () => ({}), Pa = (e) => {
  const t = e.config.user.supertokens.recipes;
  return t && t.userRoles ? R.init(t.userRoles(e)) : R.init(Ua());
}, Fa = (e) => {
  const t = [
    Ta(e),
    Ca(e),
    Pa(e)
  ];
  return e.config.user.features?.signUp?.emailVerification && t.push(ca(e)), t;
}, Va = (e) => {
  const { config: t } = e;
  On.init({
    appInfo: {
      apiDomain: t.baseUrl,
      appName: t.appName,
      websiteDomain: t.appOrigin[0]
    },
    framework: "fastify",
    recipeList: Fa(e),
    supertokens: {
      connectionURI: t.user.supertokens.connectionUri
    }
  });
}, Ma = async (e, t, n) => {
  const { config: s, log: i } = e;
  i.info("Registering supertokens plugin"), Va(e), e.setErrorHandler(ks()), await e.register(As, {
    origin: s.appOrigin,
    allowedHeaders: [
      "Content-Type",
      "st-auth-mode",
      ...On.getAllCORSHeaders()
    ],
    credentials: !0
  }), await e.register(bs), await e.register(Ds), i.info("Registering supertokens plugin complete"), e.decorate("verifySession", Ls), e.addHook("onSend", async (r, o) => {
    const a = r.server.config.user.supertokens.refreshTokenCookiePath, u = o.getHeader("set-cookie");
    if (u && a) {
      const d = (Array.isArray(u) ? u : [u]).map((f) => String(f).startsWith("sRefreshToken") ? String(f).replace(
        // eslint-disable-next-line unicorn/better-regex
        /Path=\/[^;]*/i,
        `Path=${a}`
      ) : f);
      o.removeHeader("set-cookie"), o.header("set-cookie", d);
    }
  }), n();
}, $a = Ue(Ma), Ba = async (e, t, n) => {
  try {
    t.session = await Ke.getSession(t, xs(n), {
      sessionRequired: !1,
      overrideGlobalClaimValidators: async (s) => s.filter(
        (i) => ![ws.key, G.key].includes(
          i.id
        )
      )
    });
  } catch (s) {
    if (!Ke.Error.isErrorFromSuperTokens(s))
      throw s;
  }
  e.user = t.user, e.roles = t.user?.roles;
}, ja = Ue(
  async (e, t, n) => {
    const { graphql: s } = e.config;
    await e.register($a), e.decorate("hasPermission", ra), s?.enabled && await e.register(ia), n();
  }
);
ja.updateContext = Ba;
const Ga = /* @__PURE__ */ new Set([
  "id",
  "disable",
  "enable",
  "email",
  "lastLoginAt",
  "roles",
  "signedUpAt"
]), Is = (e) => {
  for (const t of Object.keys(e))
    Ga.has($t.camelize(t)) && delete e[t];
}, Ja = {
  adminSignUp: async (e, t, n) => {
    const { app: s, config: i, reply: r } = n;
    try {
      const { email: o, password: a } = t.data, u = await R.getUsersThatHaveRole(Ce), l = await R.getUsersThatHaveRole(
        Ne
      );
      let d;
      if (u.status === "UNKNOWN_ROLE_ERROR" && l.status === "UNKNOWN_ROLE_ERROR" ? d = u.status : (u.status === "OK" && u.users.length > 0 || l.status === "OK" && l.users.length > 0) && (d = "First admin user already exists"), d)
        return new g.ErrorWithProps(d);
      const f = Se(o, i);
      if (!f.success && f.message)
        return new g.ErrorWithProps(
          f.message
        );
      const E = Be(a, i);
      if (!E.success && E.message)
        return new g.ErrorWithProps(
          E.message
        );
      const y = await ft(o, a, {
        autoVerifyEmail: !0,
        roles: [
          Ce,
          ...l.status === "OK" ? [Ne] : []
        ],
        _default: {
          request: {
            request: r.request
          }
        }
      });
      return y.status !== "OK" ? new g.ErrorWithProps(
        y.status
      ) : (await Le(r.request, r, y.user.id), y);
    } catch (o) {
      s.log.error(o);
      const a = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  },
  disableUser: async (e, t, n) => {
    const { id: s } = t;
    if (n.user?.id === s) {
      const o = new g.ErrorWithProps(
        "you cannot disable yourself"
      );
      return o.statusCode = 409, o;
    }
    return await U(
      n.config,
      n.database,
      n.dbSchema
    ).update(s, { disabled: !0 }) ? { status: "OK" } : new g.ErrorWithProps(`user id ${s} not found`, {}, 404);
  },
  enableUser: async (e, t, n) => {
    const { id: s } = t;
    return await U(
      n.config,
      n.database,
      n.dbSchema
    ).update(s, { disabled: !1 }) ? { status: "OK" } : new g.ErrorWithProps(`user id ${s} not found`, {}, 404);
  },
  changePassword: async (e, t, n) => {
    const { app: s, config: i, database: r, dbSchema: o, reply: a, user: u } = n, l = U(i, r, o);
    try {
      if (u) {
        const d = await l.changePassword(
          u.id,
          t.oldPassword,
          t.newPassword
        );
        return d.status === "OK" && await Le(a.request, a, u.id), d;
      } else
        return {
          status: "NOT_FOUND",
          message: "User not found"
        };
    } catch (d) {
      s.log.error(d);
      const f = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return f.statusCode = 500, f;
    }
  },
  updateMe: async (e, t, n) => {
    const { data: s } = t, i = U(
      n.config,
      n.database,
      n.dbSchema
    );
    try {
      if (n.user?.id) {
        Is(s);
        const r = await i.update(n.user.id, s), o = n.reply.request;
        return o.user = r, n.config.user.features?.profileValidation?.enabled && await o.session?.fetchAndSetClaim(
          new G(),
          Ze(void 0, o)
        ), r;
      } else
        return {
          status: "NOT_FOUND",
          message: "User not found"
        };
    } catch (r) {
      n.app.log.error(r);
      const o = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  }
}, Ya = {
  canAdminSignUp: async (e, t, n) => {
    const { app: s } = n;
    try {
      const i = await R.getUsersThatHaveRole(Ce), r = await R.getUsersThatHaveRole(
        Ne
      );
      return i.status === "UNKNOWN_ROLE_ERROR" && r.status === "UNKNOWN_ROLE_ERROR" ? new g.ErrorWithProps(i.status) : i.status === "OK" && i.users.length > 0 || r.status === "OK" && r.users.length > 0 ? { signUp: !1 } : { signUp: !0 };
    } catch (i) {
      s.log.error(i);
      const r = new g.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return r.statusCode = 500, r;
    }
  },
  me: async (e, t, n) => {
    if (n.user)
      return n.user;
    {
      n.app.log.error(
        "Could not able to get user from mercurius context"
      );
      const s = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return s.statusCode = 500, s;
    }
  },
  user: async (e, t, n) => {
    const i = await U(
      n.config,
      n.database,
      n.dbSchema
    ).findById(t.id);
    if (n.config.user.features?.profileValidation?.enabled) {
      const r = n.reply.request;
      await r.session?.fetchAndSetClaim(
        new G(),
        Ze(void 0, r)
      );
    }
    return i;
  },
  users: async (e, t, n) => await U(
    n.config,
    n.database,
    n.dbSchema
  ).list(
    t.limit,
    t.offset,
    t.filters ? JSON.parse(JSON.stringify(t.filters)) : void 0,
    t.sort ? JSON.parse(JSON.stringify(t.sort)) : void 0
  )
}, Yc = { Mutation: Ja, Query: Ya }, Qa = async (e, t) => {
  const { body: n, config: s, log: i } = e;
  try {
    const { email: r, password: o } = n, a = await R.getUsersThatHaveRole(Ce), u = await R.getUsersThatHaveRole(
      Ne
    );
    if (a.status === "UNKNOWN_ROLE_ERROR" && u.status === "UNKNOWN_ROLE_ERROR")
      return t.send({
        status: "ERROR",
        message: a.status
      });
    if (a.status === "OK" && a.users.length > 0 || u.status === "OK" && u.users.length > 0)
      return t.send({
        status: "ERROR",
        message: "First admin user already exists"
      });
    const l = Se(r, s);
    if (!l.success)
      return t.send({
        status: "ERROR",
        message: l.message
      });
    const d = Be(o, s);
    if (!d.success)
      return t.send({
        status: "ERROR",
        message: d.message
      });
    const f = await ft(r, o, {
      autoVerifyEmail: !0,
      roles: [
        Ce,
        ...u.status === "OK" ? [Ne] : []
      ],
      _default: {
        request: {
          request: e
        }
      }
    });
    if (f.status !== "OK")
      return t.send(f);
    await Le(e, t, f.user.id), t.send(f);
  } catch (r) {
    i.error(r), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Ha = async (e, t) => {
  const { log: n } = e;
  try {
    const s = await R.getUsersThatHaveRole(Ce), i = await R.getUsersThatHaveRole(
      Ne
    );
    if (s.status === "UNKNOWN_ROLE_ERROR" && i.status === "UNKNOWN_ROLE_ERROR")
      return t.send({
        status: "ERROR",
        message: s.status
      });
    if (s.status === "OK" && s.users.length > 0 || i.status === "OK" && i.users.length > 0)
      return t.send({ signUp: !1 });
    t.send({ signUp: !0 });
  } catch (s) {
    n.error(s), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Wa = async (e, t) => {
  try {
    const n = e.session, s = e.body, i = n && n.getUserId();
    if (!i)
      throw new Error("User not found in session");
    const r = s.oldPassword ?? "", o = s.newPassword ?? "", u = await U(
      e.config,
      e.slonik,
      e.dbSchema
    ).changePassword(
      i,
      r,
      o
    );
    u.status === "OK" && await Le(e, t, i), t.send(u);
  } catch (n) {
    e.log.error(n), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong",
      error: n
    });
  }
}, qa = async (e, t) => {
  if (e.session) {
    const { id: n } = e.params;
    return e.session.getUserId() === n ? (t.status(409), await t.send({
      message: "you cannot disable yourself"
    })) : await U(
      e.config,
      e.slonik,
      e.dbSchema
    ).update(n, { disabled: !0 }) ? await t.send({ status: "OK" }) : (t.status(404), await t.send({ message: `user id ${n} not found` }));
  } else
    throw e.log.error("could not get session"), new Error("Oops, Something went wrong");
}, Ka = async (e, t) => {
  if (e.session) {
    const { id: n } = e.params;
    return await U(
      e.config,
      e.slonik,
      e.dbSchema
    ).update(n, { disabled: !1 }) ? await t.send({ status: "OK" }) : (t.status(404), await t.send({ message: `user id ${n} not found` }));
  } else
    throw e.log.error("could not get session"), new Error("Oops, Something went wrong");
}, za = async (e, t) => {
  if (e.user)
    e.config.user.features?.profileValidation?.enabled && await e.session?.fetchAndSetClaim(
      new G(),
      Ze(void 0, e)
    ), t.send(e.user);
  else
    throw e.log.error("Could not able to get user from session"), new Error("Oops, Something went wrong");
}, Xa = async (e, t) => {
  const n = e.session?.getUserId(), s = e.body;
  if (n) {
    const i = U(
      e.config,
      e.slonik,
      e.dbSchema
    );
    Is(s);
    const r = await i.update(n, s);
    e.user = r, e.config.user.features?.profileValidation?.enabled && await e.session?.fetchAndSetClaim(
      new G(),
      Ze(void 0, e)
    ), t.send(r);
  } else
    throw e.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
}, Za = async (e, t) => {
  const n = U(
    e.config,
    e.slonik,
    e.dbSchema
  ), { id: s } = e.params, i = await n.findById(s);
  t.send(i);
}, ec = async (e, t) => {
  const n = U(
    e.config,
    e.slonik,
    e.dbSchema
  ), { limit: s, offset: i, filters: r, sort: o } = e.query, a = await n.list(
    s,
    i,
    r ? JSON.parse(r) : void 0,
    o ? JSON.parse(o) : void 0
  );
  t.send(a);
}, ie = {
  adminSignUp: Qa,
  canAdminSignUp: Ha,
  changePassword: Wa,
  disable: qa,
  enable: Ka,
  me: za,
  updateMe: Xa,
  user: Za,
  users: ec
}, Qc = async (e, t, n) => {
  const s = e.config.user.handlers?.user;
  e.get(
    $o,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(ea)
      ]
    },
    s?.users || ie.users
  ), e.get(
    Bo,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(ta)
      ]
    },
    s?.user || ie.user
  ), e.post(
    Mo,
    {
      preHandler: e.verifySession()
    },
    s?.changePassword || ie.changePassword
  ), e.get(
    In,
    {
      preHandler: e.verifySession({
        overrideGlobalClaimValidators: async (i) => i.filter(
          (r) => r.id !== G.key
        )
      })
    },
    s?.me || ie.me
  ), e.put(
    In,
    {
      preHandler: e.verifySession({
        overrideGlobalClaimValidators: async (i) => i.filter(
          (r) => r.id !== G.key
        )
      })
    },
    s?.updateMe || ie.updateMe
  ), e.put(
    jo,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(Xo)
      ]
    },
    s?.disable || ie.disable
  ), e.put(
    Go,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(Zo)
      ]
    },
    s?.enable || ie.enable
  ), e.post(
    Tn,
    s?.adminSignUp || ie.adminSignUp
  ), e.get(
    Tn,
    s?.canAdminSignUp || ie.canAdminSignUp
  ), n();
}, Ns = (e, t) => t || de(
  new Date(
    Date.now() + (e.user.invitation?.expireAfterInDays ?? bo) * (24 * 60 * 60 * 1e3)
  )
);
class tc extends wn {
  /* eslint-enabled */
  getFindByTokenSql = (t) => A.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE token = ${t};
    `;
  getListSql = (t, n, s, i) => {
    const r = _n(this.table, this.schema), o = Cs(
      this.config.user.table?.name || vs,
      this.schema
    );
    return A.type(this.validationSchema)`
      SELECT ${this.getTableFragment()}.*, ROW_TO_JSON("user") as "invited_by"
      FROM ${this.getTableFragment()}
      join ${o} "user" on ${this.getTableFragment()}."invited_by_id" = "user"."id"
      ${Rn(s, r)}
      ${Us(r, this.getSortInput(i))}
      ${An(t, n)};
    `;
  };
}
class Ss extends bn {
  static TABLE = Fo;
  create = async (t) => {
    const n = {
      AND: [
        { key: "email", operator: "eq", value: t.email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: de(/* @__PURE__ */ new Date()) },
        { key: "revokedAt", operator: "eq", value: "null" }
      ]
    };
    if (await this.count(n) > 0)
      throw new Error("Invitation already exist");
    const i = this.factory.getCreateSql(t), r = await this.database.connect(async (o) => o.query(i).then((a) => a.rows[0]));
    return r ? this.postCreate(r) : void 0;
  };
  findByToken = async (t) => {
    if (!this.validateUUID(t))
      return null;
    const n = this.factory.getFindByTokenSql(t);
    return await this.database.connect((i) => i.maybeOne(n));
  };
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new tc(this)), this._factory;
  }
  validateUUID = (t) => /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi.test(t);
}
const $ = (e, t, n) => {
  const s = e.user.services?.invitation || Ss;
  return new s(e, t, n);
}, dt = (e) => !(e.acceptedAt || e.revokedAt || Date.now() > e.expiresAt), nc = (e, t, n) => {
  const { token: s } = t;
  let i = e.user.invitation?.acceptLinkPath || Ao;
  return i = i.replace(/:token(?!\w)/g, s), new URL(i, n).href;
}, pt = async (e, t, n) => {
  const { config: s, log: i } = e, r = s.apps?.find((o) => o.id === t.appId)?.origin || Xt(n || "") || s.appOrigin[0];
  r ? et({
    fastify: e,
    subject: "Invitation for Sign Up",
    templateData: {
      invitationLink: nc(s, t, r)
    },
    templateName: "user-invitation",
    to: t.email
  }) : i.error(`Could not send email for invitation ID ${t.id}`);
}, sc = {
  acceptInvitation: async (e, t, n) => {
    const { app: s, config: i, database: r, dbSchema: o, reply: a } = n, { token: u, data: l } = t;
    try {
      const { email: d, password: f } = l, E = Se(d, i);
      if (!E.success && E.message)
        return new g.ErrorWithProps(
          E.message
        );
      const y = Be(f, i);
      if (!y.success && y.message)
        return new g.ErrorWithProps(
          y.message
        );
      const v = $(i, r, o), I = await v.findByToken(u);
      if (!I || !dt(I))
        return new g.ErrorWithProps(
          "Invitation is invalid or has expired"
        );
      if (I.email != d)
        return new g.ErrorWithProps(
          "Email do not match with the invitation"
        );
      const k = await ft(d, f, {
        roles: [I.role],
        autoVerifyEmail: !0
      });
      if (k.status !== "OK")
        return k;
      await v.update(I.id, {
        acceptedAt: de(new Date(Date.now()))
      });
      try {
        await i.user.invitation?.postAccept?.(
          a.request,
          I,
          k.user
        );
      } catch (D) {
        s.log.error(D);
      }
      return await Le(a.request, a, k.user.id), {
        ...k,
        user: {
          ...k.user,
          roles: [I.role]
        }
      };
    } catch (d) {
      s.log.error(d);
      const f = new g.ErrorWithProps(
        "Oops! Something went wrong"
      );
      return f.statusCode = 500, f;
    }
  },
  createInvitation: async (e, t, n) => {
    const { app: s, config: i, database: r, dbSchema: o, reply: a, user: u } = n;
    try {
      if (!u)
        throw new Error("User not found in session");
      const { appId: l, email: d, expiresAt: f, payload: E, role: y } = t.data, v = Se(d, i);
      if (!v.success && v.message)
        return new g.ErrorWithProps(v.message);
      const I = U(i, r, o), k = {
        key: "email",
        operator: "eq",
        value: d
      };
      if (await I.count(k) > 0)
        return new g.ErrorWithProps(
          `User with email ${d} already exists`
        );
      const _e = $(i, r, o), V = {
        email: d,
        expiresAt: Ns(i, f),
        invitedById: u.id,
        role: y || i.user.role || Nt
      }, M = i.apps?.find((L) => L.id == l);
      if (M)
        if (M.supportedRoles.includes(V.role))
          V.appId = l;
        else
          return new g.ErrorWithProps(
            `App ${M.name} does not support role ${V.role}`
          );
      Object.keys(E || {}).length > 0 && (V.payload = JSON.stringify(E));
      let ee;
      try {
        ee = await _e.create(V);
      } catch (L) {
        return new g.ErrorWithProps(L.message);
      }
      if (ee) {
        try {
          const { headers: L, hostname: se } = a.request, Re = L.referer || L.origin || se;
          pt(s, ee, Re);
        } catch (L) {
          s.log.error(L);
        }
        return ee;
      }
    } catch (l) {
      s.log.error(l);
      const d = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  },
  resendInvitation: async (e, t, n) => {
    const { app: s, config: i, database: r, dbSchema: o, reply: a } = n, l = await $(i, r, o).findById(t.id);
    if (!l || !dt(l))
      return new g.ErrorWithProps(
        "Invitation is invalid or has expired"
      );
    const { headers: d, hostname: f } = a.request, E = d.referer || d.origin || f;
    try {
      pt(s, l, E);
    } catch (y) {
      s.log.error(y);
    }
    return l;
  },
  revokeInvitation: async (e, t, n) => {
    const s = $(
      n.config,
      n.database,
      n.dbSchema
    );
    let i = await s.findById(t.id), r;
    return i ? i.acceptedAt ? r = "Invitation is already accepted" : Date.now() > i.expiresAt ? r = "Invitation is expired" : i.revokedAt && (r = "Invitation is already revoked") : r = "Invitation not found", r ? new g.ErrorWithProps(r) : (i = await s.update(t.id, {
      revokedAt: de(new Date(Date.now()))
    }), i);
  },
  deleteInvitation: async (e, t, n) => {
    const i = await $(
      n.config,
      n.database,
      n.dbSchema
    ).delete(t.id);
    let r;
    return i || (r = "Invitation not found"), r ? new g.ErrorWithProps(r) : i;
  }
}, ic = {
  getInvitationByToken: async (e, t, n) => {
    try {
      return await $(
        n.config,
        n.database,
        n.dbSchema
      ).findByToken(t.token);
    } catch (s) {
      n.app.log.error(s);
      const i = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return i.statusCode = 500, i;
    }
  },
  invitations: async (e, t, n) => await $(
    n.config,
    n.database,
    n.dbSchema
  ).list(
    t.limit,
    t.offset,
    t.filters ? JSON.parse(JSON.stringify(t.filters)) : void 0,
    t.sort ? JSON.parse(JSON.stringify(t.sort)) : void 0
  )
}, Hc = { Mutation: sc, Query: ic }, rc = async (e, t) => {
  const { body: n, config: s, dbSchema: i, log: r, params: o, slonik: a } = e, { token: u } = o;
  try {
    const { email: l, password: d } = n, f = Se(l, s);
    if (!f.success)
      return t.send({
        status: "ERROR",
        message: f.message
      });
    const E = Be(d, s);
    if (!E.success)
      return t.send({
        status: "ERROR",
        message: E.message
      });
    const y = $(s, a, i), v = await y.findByToken(u);
    if (!v || !dt(v))
      return t.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    if (v.email != l)
      return t.send({
        status: "ERROR",
        message: "Email do not match with the invitation"
      });
    const I = await ft(l, d, {
      roles: [v.role],
      autoVerifyEmail: !0
    });
    if (I.status !== "OK")
      return t.send(I);
    await y.update(v.id, {
      acceptedAt: de(new Date(Date.now()))
    });
    try {
      await s.user.invitation?.postAccept?.(
        e,
        v,
        I.user
      );
    } catch (k) {
      r.error(k);
    }
    await Le(e, t, I.user.id), t.send({
      ...I,
      user: {
        ...I.user,
        roles: [v.role]
      }
    });
  } catch (l) {
    r.error(l), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, oc = async (e, t) => {
  const {
    body: n,
    config: s,
    dbSchema: i,
    headers: r,
    hostname: o,
    log: a,
    server: u,
    session: l,
    slonik: d
  } = e;
  try {
    const f = l && l.getUserId();
    if (!f)
      throw new Error("User not found in session");
    const { appId: E, email: y, expiresAt: v, payload: I, role: k } = n, D = Se(y, s);
    if (!D.success)
      return t.send({
        status: "ERROR",
        message: D.message
      });
    const _e = U(s, d, i), V = {
      key: "email",
      operator: "eq",
      value: y
    };
    if (await _e.count(V) > 0)
      return t.send({
        status: "ERROR",
        message: `User with email ${y} already exists`
      });
    const ee = $(s, d, i), L = {
      email: y,
      expiresAt: Ns(s, v),
      invitedById: f,
      role: k || s.user.role || Nt
    }, se = s.apps?.find((je) => je.id == E);
    if (se)
      if (se.supportedRoles.includes(L.role))
        L.appId = E;
      else
        return t.send({
          status: "ERROR",
          message: `App ${se.name} does not support role ${L.role}`
        });
    Object.keys(I || {}).length > 0 && (L.payload = JSON.stringify(I));
    let Re;
    try {
      Re = await ee.create(L);
    } catch (je) {
      return t.send({
        status: "ERROR",
        message: je.message
      });
    }
    if (Re) {
      const je = r.referer || r.origin || o;
      try {
        pt(u, Re, je);
      } catch (Os) {
        a.error(Os);
      }
      const Zt = Re;
      delete Zt.token, t.send(Zt);
    }
  } catch (f) {
    a.error(f), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, ac = async (e, t) => {
  const { config: n, dbSchema: s, log: i, params: r, slonik: o } = e;
  try {
    const { id: a } = r, l = await new Ss(n, o, s).delete(a);
    if (!l)
      return t.send({
        status: "error",
        message: "Invitation not found"
      });
    const d = l;
    delete d.token, t.send(d);
  } catch (a) {
    i.error(a), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, cc = async (e, t) => {
  const { config: n, dbSchema: s, log: i, params: r, slonik: o } = e, { token: a } = r;
  try {
    const l = await $(n, o, s).findByToken(a);
    t.send(l);
  } catch (u) {
    i.error(u), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, uc = async (e, t) => {
  const { config: n, dbSchema: s, log: i, query: r, slonik: o } = e;
  try {
    const { limit: a, offset: u, filters: l, sort: d } = r, E = await $(n, o, s).list(
      a,
      u,
      l ? JSON.parse(l) : void 0,
      d ? JSON.parse(d) : void 0
    );
    for (const y of E.data)
      delete y.token;
    t.send(E);
  } catch (a) {
    i.error(a), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, lc = async (e, t) => {
  const { config: n, dbSchema: s, headers: i, hostname: r, log: o, params: a, slonik: u, server: l } = e;
  try {
    const { id: d } = a, E = await $(n, u, s).findById(d);
    if (!E || !dt(E))
      return t.send({
        status: "ERROR",
        message: "Invitation is invalid or has expired"
      });
    const y = i.referer || i.origin || r;
    try {
      pt(l, E, y);
    } catch (I) {
      o.error(I);
    }
    const v = E;
    delete v.token, t.send(v);
  } catch (d) {
    o.error(d), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, dc = async (e, t) => {
  const { config: n, dbSchema: s, log: i, params: r, slonik: o } = e;
  try {
    const { id: a } = r, u = $(n, o, s);
    let l = await u.findById(a);
    if (l) {
      if (l.acceptedAt)
        return t.send({
          status: "error",
          message: "Invitation is already accepted"
        });
      if (Date.now() > l.expiresAt)
        return t.send({
          status: "error",
          message: "Invitation is expired"
        });
      if (l.revokedAt)
        return t.send({
          status: "error",
          message: "Invitation is already revoked"
        });
    } else
      return t.send({
        status: "error",
        message: "Invitation not found"
      });
    l = await u.update(a, {
      revokedAt: de(new Date(Date.now()))
    });
    const d = l;
    delete d.token, t.send(d);
  } catch (a) {
    i.error(a), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, fe = {
  acceptInvitation: rc,
  createInvitation: oc,
  deleteInvitation: ac,
  getInvitationByToken: cc,
  listInvitation: uc,
  resendInvitation: lc,
  revokeInvitation: dc
}, Wc = async (e, t, n) => {
  const s = e.config.user.handlers?.invitation;
  e.get(
    ko,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(qo)
      ]
    },
    s?.list || fe.listInvitation
  ), e.post(
    xo,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(Ho)
      ]
    },
    s?.create || fe.createInvitation
  ), e.get(
    Co,
    s?.getByToken || fe.getInvitationByToken
  ), e.post(
    Do,
    s?.accept || fe.acceptInvitation
  ), e.put(
    Po,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(zo)
      ]
    },
    s?.revoke || fe.revokeInvitation
  ), e.post(
    Uo,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(Ko)
      ]
    },
    s?.resend || fe.resendInvitation
  ), e.delete(
    Lo,
    {
      preHandler: [
        e.verifySession(),
        e.hasPermission(Wo)
      ]
    },
    s?.delete || fe.deleteInvitation
  ), n();
}, pc = {
  permissions: async (e, t, n) => {
    const { app: s, config: i } = n;
    try {
      return i.user.permissions || [];
    } catch (r) {
      s.log.error(r);
      const o = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return o.statusCode = 500, o;
    }
  }
}, qc = { Query: pc }, fc = async (e, t) => {
  const { config: n, log: s } = e;
  try {
    const i = n.user.permissions || [];
    t.send({ permissions: i });
  } catch (i) {
    s.error(i), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, hc = {
  getPermissions: fc
}, Kc = async (e, t, n) => {
  e.get(
    Jo,
    {
      preHandler: [e.verifySession()]
    },
    hc.getPermissions
  ), n();
};
class j extends Error {
  statusCode;
  constructor({ message: t, name: n, statusCode: s }) {
    super(t), this.message = t, this.name = n, this.statusCode = s;
  }
}
class ne {
  createRole = async (t, n) => {
    const { roles: s } = await R.getAllRoles(t);
    if (s.includes(t))
      throw new j({
        name: "ROLE_ALREADY_EXISTS",
        message: "Unable to create role as it already exists",
        statusCode: 422
      });
    return { status: (await R.createNewRoleOrAddPermissions(
      t,
      n || []
    )).status };
  };
  deleteRole = async (t) => {
    const n = await R.getUsersThatHaveRole(t);
    if (n.status === "UNKNOWN_ROLE_ERROR")
      throw new j({
        name: n.status,
        message: "Invalid role",
        statusCode: 422
      });
    if (n.users.length > 0)
      throw new j({
        name: "ROLE_IN_USE",
        message: "The role is currently assigned to one or more users and cannot be deleted",
        statusCode: 422
      });
    return { status: (await R.deleteRole(t)).status };
  };
  getPermissionsForRole = async (t) => {
    let n = [];
    const s = await R.getPermissionsForRole(t);
    return s.status === "OK" && (n = s.permissions), n;
  };
  getRoles = async () => {
    let t = [];
    const n = await R.getAllRoles();
    return n.status === "OK" && (t = await Promise.all(
      n.roles.map(async (s) => {
        const i = await R.getPermissionsForRole(s);
        return {
          role: s,
          permissions: i.status === "OK" ? i.permissions : []
        };
      })
    )), t;
  };
  updateRolePermissions = async (t, n) => {
    const s = await R.getPermissionsForRole(t);
    if (s.status === "UNKNOWN_ROLE_ERROR")
      throw new j({
        name: "UNKNOWN_ROLE_ERROR",
        message: "Invalid role",
        statusCode: 422
      });
    const i = s.permissions, r = n.filter(
      (u) => !i.includes(u)
    ), o = i.filter(
      (u) => !n.includes(u)
    );
    return await R.removePermissionsFromRole(t, o), await R.createNewRoleOrAddPermissions(t, r), {
      status: "OK",
      permissions: await this.getPermissionsForRole(t)
    };
  };
}
const mc = {
  createRole: async (e, t, n) => {
    const { app: s } = n;
    try {
      return await new ne().createRole(
        t.role,
        t.permissions
      );
    } catch (i) {
      if (i instanceof j) {
        const o = new g.ErrorWithProps(i.name);
        return o.statusCode = i.statusCode, o;
      }
      s.log.error(i);
      const r = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return r.statusCode = 500, r;
    }
  },
  deleteRole: async (e, t, n) => {
    const { app: s } = n;
    try {
      const i = new ne(), { role: r } = t;
      return await i.deleteRole(r);
    } catch (i) {
      if (i instanceof j) {
        const o = new g.ErrorWithProps(i.name);
        return o.statusCode = i.statusCode, o;
      }
      s.log.error(i);
      const r = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return r.statusCode = 500, r;
    }
  },
  updateRolePermissions: async (e, t, n) => {
    const { app: s } = n, { permissions: i, role: r } = t;
    try {
      return await new ne().updateRolePermissions(
        r,
        i
      );
    } catch (o) {
      if (o instanceof j) {
        const u = new g.ErrorWithProps(o.name);
        return u.statusCode = o.statusCode, u;
      }
      s.log.error(o);
      const a = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, Ec = {
  roles: async (e, t, n) => {
    const { app: s } = n;
    try {
      return await new ne().getRoles();
    } catch (i) {
      s.log.error(i);
      const r = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return r.statusCode = 500, r;
    }
  },
  rolePermissions: async (e, t, n) => {
    const { app: s } = n, { role: i } = t;
    let r = [];
    try {
      return i && (r = await new ne().getPermissionsForRole(i)), r;
    } catch (o) {
      s.log.error(o);
      const a = new g.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return a.statusCode = 500, a;
    }
  }
}, zc = { Mutation: mc, Query: Ec }, vc = async (e, t) => {
  const { body: n, log: s } = e, { role: i, permissions: r } = n;
  try {
    const a = await new ne().createRole(i, r);
    return t.send(a);
  } catch (o) {
    return o instanceof j ? (t.status(o.statusCode), t.send({
      message: o.message,
      name: o.name,
      statusCode: o.statusCode
    })) : (s.error(o), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, gc = async (e, t) => {
  const { log: n, query: s } = e;
  try {
    let { role: i } = s;
    if (i) {
      try {
        i = JSON.parse(i);
      } catch {
      }
      if (typeof i != "string")
        throw new j({
          name: "UNKNOWN_ROLE_ERROR",
          message: "Invalid role",
          statusCode: 422
        });
      const o = await new ne().deleteRole(i);
      return t.send(o);
    }
    throw new j({
      name: "UNKNOWN_ROLE_ERROR",
      message: "Invalid role",
      statusCode: 422
    });
  } catch (i) {
    return i instanceof j ? (t.status(i.statusCode), t.send({
      message: i.message,
      name: i.name,
      statusCode: i.statusCode
    })) : (n.error(i), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, yc = async (e, t) => {
  const { log: n, query: s } = e;
  let i = [];
  try {
    let { role: r } = s;
    if (r) {
      try {
        r = JSON.parse(r);
      } catch {
      }
      if (typeof r != "string")
        return t.send({ permissions: i });
      i = await new ne().getPermissionsForRole(r);
    }
    return t.send({ permissions: i });
  } catch (r) {
    return n.error(r), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Tc = async (e, t) => {
  const { log: n } = e;
  try {
    const i = await new ne().getRoles();
    return t.send({ roles: i });
  } catch (s) {
    return n.error(s), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    });
  }
}, Ic = async (e, t) => {
  const { log: n, body: s } = e;
  try {
    const { role: i, permissions: r } = s, a = await new ne().updateRolePermissions(
      i,
      r
    );
    return t.send(a);
  } catch (i) {
    return i instanceof j ? (t.status(i.statusCode), t.send({
      message: i.message,
      name: i.name,
      statusCode: i.statusCode
    })) : (n.error(i), t.status(500), t.send({
      status: "ERROR",
      message: "Oops! Something went wrong"
    }));
  }
}, Je = {
  deleteRole: gc,
  createRole: vc,
  getRoles: Tc,
  getPermissions: yc,
  updatePermissions: Ic
}, Xc = async (e, t, n) => {
  e.delete(
    _t,
    {
      preHandler: [e.verifySession()]
    },
    Je.deleteRole
  ), e.get(
    _t,
    {
      preHandler: [e.verifySession()]
    },
    Je.getRoles
  ), e.get(
    Nn,
    {
      preHandler: [e.verifySession()]
    },
    Je.getPermissions
  ), e.post(
    _t,
    {
      preHandler: [e.verifySession()]
    },
    Je.createRole
  ), e.put(
    Nn,
    {
      preHandler: [e.verifySession()]
    },
    Je.updatePermissions
  ), n();
}, Zc = async (e) => {
  const { roles: t } = await R.getAllRoles();
  return t.includes(e);
}, Nc = oe`
  type Invitation {
    id: Int!
    acceptedAt: Float
    appId: Int
    email: String!
    expiresAt: Float!
    invitedById: String!
    payload: JSON
    revokedAt: Float
    role: String!
    createdAt: Float!
    updatedAt: Float!
  }

  type Invitations {
    totalCount: Int
    filteredCount: Int
    data: [Invitation]!
  }

  input AcceptInvitationFieldInput {
    email: String!
    password: String!
  }

  input InvitationCreateInput {
    appId: Int
    email: String!
    expiresAt: String
    payload: JSON
    role: String!
  }

  input InvitationUpdateInput {
    acceptedAt: String
    expiresAt: String
    revokedAt: String
  }

  type Mutation {
    acceptInvitation(
      token: String!
      data: AcceptInvitationFieldInput!
    ): AuthResponse
    createInvitation(data: InvitationCreateInput!): Invitation @auth
    deleteInvitation(id: Int!): Invitation @auth
    resendInvitation(id: Int!): Invitation @auth
    revokeInvitation(id: Int!): Invitation @auth
  }

  type Query {
    invitations(
      limit: Int
      offset: Int
      filters: Filters
      sort: [SortInput]
    ): Invitations!
    getInvitationByToken(token: String!): Invitation
  }
`, Sc = oe`
  type Role {
    role: String!
    permissions: [String]!
  }

  type UpdateRolePermissionsResponse {
    status: String!
    permissions: [String]!
  }

  type RoleResponse {
    status: String!
  }

  type Mutation {
    createRole(role: String!, permissions: [String]): RoleResponse! @auth
    deleteRole(role: String!): RoleResponse! @auth
    updateRolePermissions(
      role: String!
      permissions: [String]!
    ): UpdateRolePermissionsResponse! @auth
  }

  type Query {
    permissions: [String]! @auth
    roles: [Role]! @auth
    rolePermissions(role: String!): [String]! @auth
  }
`, Oc = oe`
  type User {
    id: String!
    disabled: Boolean!
    email: String!
    lastLoginAt: Float!
    roles: [String]
    signedUpAt: Float!
    timeJoined: Float
  }

  type Users {
    totalCount: Int
    filteredCount: Int
    data: [User]!
  }

  type ChangePasswordResponse {
    statusCode: Int
    status: String
    message: String
  }

  type AuthResponse {
    status: String!
    user: User!
  }

  type CanAdminSignUpResponse {
    signUp: Boolean!
  }

  type UpdateUserResponse {
    status: String!
  }

  input UserUpdateInput {
    id: String
  }

  input SingUpFieldInput {
    email: String!
    password: String!
  }

  type Mutation {
    adminSignUp(data: SingUpFieldInput!): AuthResponse
    disableUser(id: String!): UpdateUserResponse @auth
    enableUser(id: String!): UpdateUserResponse @auth
    changePassword(
      oldPassword: String
      newPassword: String
    ): ChangePasswordResponse @auth
    updateMe(data: UserUpdateInput): User @auth(profileValidation: false)
  }

  type Query {
    canAdminSignUp: CanAdminSignUpResponse
    user(id: String): User @auth
    users(limit: Int, offset: Int, filters: Filters, sort: [SortInput]): Users!
      @auth
    me: User! @auth(profileValidation: false)
  }
`, eu = Oo([
  _o,
  Nc,
  Sc,
  Oc
]);
export {
  Yo as EMAIL_VERIFICATION_MODE,
  Qo as EMAIL_VERIFICATION_PATH,
  Ao as INVITATION_ACCEPT_LINK_PATH,
  bo as INVITATION_EXPIRE_AFTER_IN_DAYS,
  Ss as InvitationService,
  tc as InvitationSqlFactory,
  Ho as PERMISSIONS_INVITATIONS_CREATE,
  Wo as PERMISSIONS_INVITATIONS_DELETE,
  qo as PERMISSIONS_INVITATIONS_LIST,
  Ko as PERMISSIONS_INVITATIONS_RESEND,
  zo as PERMISSIONS_INVITATIONS_REVOKE,
  Xo as PERMISSIONS_USERS_DISABLE,
  Zo as PERMISSIONS_USERS_ENABLE,
  ea as PERMISSIONS_USERS_LIST,
  ta as PERMISSIONS_USERS_READ,
  G as ProfileValidationClaim,
  Vo as RESET_PASSWORD_PATH,
  Ce as ROLE_ADMIN,
  Ne as ROLE_SUPERADMIN,
  Nt as ROLE_USER,
  Mo as ROUTE_CHANGE_PASSWORD,
  ko as ROUTE_INVITATIONS,
  Do as ROUTE_INVITATIONS_ACCEPT,
  xo as ROUTE_INVITATIONS_CREATE,
  Lo as ROUTE_INVITATIONS_DELETE,
  Co as ROUTE_INVITATIONS_GET_BY_TOKEN,
  Uo as ROUTE_INVITATIONS_RESEND,
  Po as ROUTE_INVITATIONS_REVOKE,
  In as ROUTE_ME,
  Jo as ROUTE_PERMISSIONS,
  _t as ROUTE_ROLES,
  Nn as ROUTE_ROLES_PERMISSIONS,
  Tn as ROUTE_SIGNUP_ADMIN,
  $o as ROUTE_USERS,
  jo as ROUTE_USERS_DISABLE,
  Go as ROUTE_USERS_ENABLE,
  Bo as ROUTE_USERS_FIND_BY_ID,
  ne as RoleService,
  Fo as TABLE_INVITATIONS,
  vs as TABLE_USERS,
  ha as UserService,
  la as UserSqlFactory,
  Ts as areRolesExist,
  Ns as computeInvitationExpiresAt,
  Ze as createUserContext,
  ja as default,
  su as formatDate,
  $ as getInvitationService,
  Xt as getOrigin,
  U as getUserService,
  gs as hasUserPermission,
  Hc as invitationResolver,
  Wc as invitationRoutes,
  dt as isInvitationValid,
  Zc as isRoleExists,
  qc as permissionResolver,
  Kc as permissionRoutes,
  zc as roleResolver,
  Xc as roleRoutes,
  et as sendEmail,
  pt as sendInvitation,
  Yc as userResolver,
  Qc as userRoutes,
  eu as userSchema,
  Se as validateEmail,
  Be as validatePassword,
  Sa as verifyEmail
};
