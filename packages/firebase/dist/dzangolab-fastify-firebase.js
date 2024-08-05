import Vt from "fastify-plugin";
import k from "mercurius";
import { apps as kn, initializeApp as Ln, credential as wn, messaging as Rn } from "firebase-admin";
import { sql as Oe } from "slonik";
import { DefaultSqlFactory as Fn, BaseService as Cn } from "@dzangolab/fastify-slonik";
function g(e, t) {
  if (!!!e)
    throw new Error(t);
}
function se(e) {
  return typeof e == "object" && e !== null;
}
function at(e, t) {
  if (!!!e)
    throw new Error(
      t ?? "Unexpected invariant triggered."
    );
}
const Un = /\r\n|[\n\r]/g;
function We(e, t) {
  let n = 0, i = 1;
  for (const s of e.body.matchAll(Un)) {
    if (typeof s.index == "number" || at(!1), s.index >= t)
      break;
    n = s.index + s[0].length, i += 1;
  }
  return {
    line: i,
    column: t + 1 - n
  };
}
function Mn(e) {
  return $t(
    e.source,
    We(e.source, e.start)
  );
}
function $t(e, t) {
  const n = e.locationOffset.column - 1, i = "".padStart(n) + e.body, s = t.line - 1, r = e.locationOffset.line - 1, a = t.line + r, c = t.line === 1 ? n : 0, l = t.column + c, p = `${e.name}:${a}:${l}
`, d = i.split(/\r\n|[\n\r]/g), m = d[s];
  if (m.length > 120) {
    const N = Math.floor(l / 80), A = l % 80, v = [];
    for (let L = 0; L < m.length; L += 80)
      v.push(m.slice(L, L + 80));
    return p + It([
      [`${a} |`, v[0]],
      ...v.slice(1, N + 1).map((L) => ["|", L]),
      ["|", "^".padStart(A)],
      ["|", v[N + 1]]
    ]);
  }
  return p + It([
    // Lines specified like this: ["prefix", "string"],
    [`${a - 1} |`, d[s - 1]],
    [`${a} |`, m],
    ["|", "^".padStart(l)],
    [`${a + 1} |`, d[s + 1]]
  ]);
}
function It(e) {
  const t = e.filter(([i, s]) => s !== void 0), n = Math.max(...t.map(([i]) => i.length));
  return t.map(([i, s]) => i.padStart(n) + (s ? " " + s : "")).join(`
`);
}
function Pn(e) {
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
class I extends Error {
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
    var i, s, r;
    const { nodes: a, source: c, positions: l, path: p, originalError: d, extensions: m } = Pn(n);
    super(t), this.name = "GraphQLError", this.path = p ?? void 0, this.originalError = d ?? void 0, this.nodes = gt(
      Array.isArray(a) ? a : a ? [a] : void 0
    );
    const N = gt(
      (i = this.nodes) === null || i === void 0 ? void 0 : i.map((v) => v.loc).filter((v) => v != null)
    );
    this.source = c ?? (N == null || (s = N[0]) === null || s === void 0 ? void 0 : s.source), this.positions = l ?? N?.map((v) => v.start), this.locations = l && c ? l.map((v) => We(c, v)) : N?.map((v) => We(v.source, v.start));
    const A = se(
      d?.extensions
    ) ? d?.extensions : void 0;
    this.extensions = (r = m ?? A) !== null && r !== void 0 ? r : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
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
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, I) : Object.defineProperty(this, "stack", {
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

` + Mn(n.loc));
    else if (this.source && this.locations)
      for (const n of this.locations)
        t += `

` + $t(this.source, n);
    return t;
  }
  toJSON() {
    const t = {
      message: this.message
    };
    return this.locations != null && (t.locations = this.locations), this.path != null && (t.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (t.extensions = this.extensions), t;
  }
}
function gt(e) {
  return e === void 0 || e.length === 0 ? void 0 : e;
}
function x(e, t, n) {
  return new I(`Syntax Error: ${n}`, {
    source: e,
    positions: [t]
  });
}
class jn {
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
  constructor(t, n, i) {
    this.start = t.start, this.end = n.end, this.startToken = t, this.endToken = n, this.source = i;
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
class Gt {
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
  constructor(t, n, i, s, r, a) {
    this.kind = t, this.start = n, this.end = i, this.line = s, this.column = r, this.value = a, this.prev = null, this.next = null;
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
const Yt = {
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
}, Bn = new Set(Object.keys(Yt));
function _t(e) {
  const t = e?.kind;
  return typeof t == "string" && Bn.has(t);
}
var J;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(J || (J = {}));
var E;
(function(e) {
  e.QUERY = "QUERY", e.MUTATION = "MUTATION", e.SUBSCRIPTION = "SUBSCRIPTION", e.FIELD = "FIELD", e.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", e.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", e.INLINE_FRAGMENT = "INLINE_FRAGMENT", e.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", e.SCHEMA = "SCHEMA", e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.FIELD_DEFINITION = "FIELD_DEFINITION", e.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.ENUM_VALUE = "ENUM_VALUE", e.INPUT_OBJECT = "INPUT_OBJECT", e.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(E || (E = {}));
var o;
(function(e) {
  e.NAME = "Name", e.DOCUMENT = "Document", e.OPERATION_DEFINITION = "OperationDefinition", e.VARIABLE_DEFINITION = "VariableDefinition", e.SELECTION_SET = "SelectionSet", e.FIELD = "Field", e.ARGUMENT = "Argument", e.FRAGMENT_SPREAD = "FragmentSpread", e.INLINE_FRAGMENT = "InlineFragment", e.FRAGMENT_DEFINITION = "FragmentDefinition", e.VARIABLE = "Variable", e.INT = "IntValue", e.FLOAT = "FloatValue", e.STRING = "StringValue", e.BOOLEAN = "BooleanValue", e.NULL = "NullValue", e.ENUM = "EnumValue", e.LIST = "ListValue", e.OBJECT = "ObjectValue", e.OBJECT_FIELD = "ObjectField", e.DIRECTIVE = "Directive", e.NAMED_TYPE = "NamedType", e.LIST_TYPE = "ListType", e.NON_NULL_TYPE = "NonNullType", e.SCHEMA_DEFINITION = "SchemaDefinition", e.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", e.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", e.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", e.FIELD_DEFINITION = "FieldDefinition", e.INPUT_VALUE_DEFINITION = "InputValueDefinition", e.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", e.UNION_TYPE_DEFINITION = "UnionTypeDefinition", e.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", e.ENUM_VALUE_DEFINITION = "EnumValueDefinition", e.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", e.DIRECTIVE_DEFINITION = "DirectiveDefinition", e.SCHEMA_EXTENSION = "SchemaExtension", e.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", e.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", e.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", e.UNION_TYPE_EXTENSION = "UnionTypeExtension", e.ENUM_TYPE_EXTENSION = "EnumTypeExtension", e.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(o || (o = {}));
function Ze(e) {
  return e === 9 || e === 32;
}
function Ae(e) {
  return e >= 48 && e <= 57;
}
function Qt(e) {
  return e >= 97 && e <= 122 || // A-Z
  e >= 65 && e <= 90;
}
function ct(e) {
  return Qt(e) || e === 95;
}
function Jt(e) {
  return Qt(e) || Ae(e) || e === 95;
}
function Vn(e) {
  var t;
  let n = Number.MAX_SAFE_INTEGER, i = null, s = -1;
  for (let a = 0; a < e.length; ++a) {
    var r;
    const c = e[a], l = $n(c);
    l !== c.length && (i = (r = i) !== null && r !== void 0 ? r : a, s = a, a !== 0 && l < n && (n = l));
  }
  return e.map((a, c) => c === 0 ? a : a.slice(n)).slice(
    (t = i) !== null && t !== void 0 ? t : 0,
    s + 1
  );
}
function $n(e) {
  let t = 0;
  for (; t < e.length && Ze(e.charCodeAt(t)); )
    ++t;
  return t;
}
function Gn(e, t) {
  const n = e.replace(/"""/g, '\\"""'), i = n.split(/\r\n|[\n\r]/g), s = i.length === 1, r = i.length > 1 && i.slice(1).every((A) => A.length === 0 || Ze(A.charCodeAt(0))), a = n.endsWith('\\"""'), c = e.endsWith('"') && !a, l = e.endsWith("\\"), p = c || l, d = !(t != null && t.minimize) && // add leading and trailing new lines only if it improves readability
  (!s || e.length > 70 || p || r || a);
  let m = "";
  const N = s && Ze(e.charCodeAt(0));
  return (d && !N || r) && (m += `
`), m += n, (d || p) && (m += `
`), '"""' + m + '"""';
}
var u;
(function(e) {
  e.SOF = "<SOF>", e.EOF = "<EOF>", e.BANG = "!", e.DOLLAR = "$", e.AMP = "&", e.PAREN_L = "(", e.PAREN_R = ")", e.SPREAD = "...", e.COLON = ":", e.EQUALS = "=", e.AT = "@", e.BRACKET_L = "[", e.BRACKET_R = "]", e.BRACE_L = "{", e.PIPE = "|", e.BRACE_R = "}", e.NAME = "Name", e.INT = "Int", e.FLOAT = "Float", e.STRING = "String", e.BLOCK_STRING = "BlockString", e.COMMENT = "Comment";
})(u || (u = {}));
class Yn {
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
    const n = new Gt(u.SOF, 0, 0, 0, 0);
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
    if (t.kind !== u.EOF)
      do
        if (t.next)
          t = t.next;
        else {
          const n = Jn(this, t.end);
          t.next = n, n.prev = t, t = n;
        }
      while (t.kind === u.COMMENT);
    return t;
  }
}
function Qn(e) {
  return e === u.BANG || e === u.DOLLAR || e === u.AMP || e === u.PAREN_L || e === u.PAREN_R || e === u.SPREAD || e === u.COLON || e === u.EQUALS || e === u.AT || e === u.BRACKET_L || e === u.BRACKET_R || e === u.BRACE_L || e === u.PIPE || e === u.BRACE_R;
}
function me(e) {
  return e >= 0 && e <= 55295 || e >= 57344 && e <= 1114111;
}
function je(e, t) {
  return Ht(e.charCodeAt(t)) && zt(e.charCodeAt(t + 1));
}
function Ht(e) {
  return e >= 55296 && e <= 56319;
}
function zt(e) {
  return e >= 56320 && e <= 57343;
}
function re(e, t) {
  const n = e.source.body.codePointAt(t);
  if (n === void 0)
    return u.EOF;
  if (n >= 32 && n <= 126) {
    const i = String.fromCodePoint(n);
    return i === '"' ? `'"'` : `"${i}"`;
  }
  return "U+" + n.toString(16).toUpperCase().padStart(4, "0");
}
function b(e, t, n, i, s) {
  const r = e.line, a = 1 + n - e.lineStart;
  return new Gt(t, n, i, r, a, s);
}
function Jn(e, t) {
  const n = e.source.body, i = n.length;
  let s = t;
  for (; s < i; ) {
    const r = n.charCodeAt(s);
    switch (r) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++s;
        continue;
      case 10:
        ++s, ++e.line, e.lineStart = s;
        continue;
      case 13:
        n.charCodeAt(s + 1) === 10 ? s += 2 : ++s, ++e.line, e.lineStart = s;
        continue;
      case 35:
        return Hn(e, s);
      case 33:
        return b(e, u.BANG, s, s + 1);
      case 36:
        return b(e, u.DOLLAR, s, s + 1);
      case 38:
        return b(e, u.AMP, s, s + 1);
      case 40:
        return b(e, u.PAREN_L, s, s + 1);
      case 41:
        return b(e, u.PAREN_R, s, s + 1);
      case 46:
        if (n.charCodeAt(s + 1) === 46 && n.charCodeAt(s + 2) === 46)
          return b(e, u.SPREAD, s, s + 3);
        break;
      case 58:
        return b(e, u.COLON, s, s + 1);
      case 61:
        return b(e, u.EQUALS, s, s + 1);
      case 64:
        return b(e, u.AT, s, s + 1);
      case 91:
        return b(e, u.BRACKET_L, s, s + 1);
      case 93:
        return b(e, u.BRACKET_R, s, s + 1);
      case 123:
        return b(e, u.BRACE_L, s, s + 1);
      case 124:
        return b(e, u.PIPE, s, s + 1);
      case 125:
        return b(e, u.BRACE_R, s, s + 1);
      case 34:
        return n.charCodeAt(s + 1) === 34 && n.charCodeAt(s + 2) === 34 ? Kn(e, s) : Xn(e, s);
    }
    if (Ae(r) || r === 45)
      return zn(e, s, r);
    if (ct(r))
      return ei(e, s);
    throw x(
      e.source,
      s,
      r === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : me(r) || je(n, s) ? `Unexpected character: ${re(e, s)}.` : `Invalid character: ${re(e, s)}.`
    );
  }
  return b(e, u.EOF, i, i);
}
function Hn(e, t) {
  const n = e.source.body, i = n.length;
  let s = t + 1;
  for (; s < i; ) {
    const r = n.charCodeAt(s);
    if (r === 10 || r === 13)
      break;
    if (me(r))
      ++s;
    else if (je(n, s))
      s += 2;
    else
      break;
  }
  return b(
    e,
    u.COMMENT,
    t,
    s,
    n.slice(t + 1, s)
  );
}
function zn(e, t, n) {
  const i = e.source.body;
  let s = t, r = n, a = !1;
  if (r === 45 && (r = i.charCodeAt(++s)), r === 48) {
    if (r = i.charCodeAt(++s), Ae(r))
      throw x(
        e.source,
        s,
        `Invalid number, unexpected digit after 0: ${re(
          e,
          s
        )}.`
      );
  } else
    s = ze(e, s, r), r = i.charCodeAt(s);
  if (r === 46 && (a = !0, r = i.charCodeAt(++s), s = ze(e, s, r), r = i.charCodeAt(s)), (r === 69 || r === 101) && (a = !0, r = i.charCodeAt(++s), (r === 43 || r === 45) && (r = i.charCodeAt(++s)), s = ze(e, s, r), r = i.charCodeAt(s)), r === 46 || ct(r))
    throw x(
      e.source,
      s,
      `Invalid number, expected digit but got: ${re(
        e,
        s
      )}.`
    );
  return b(
    e,
    a ? u.FLOAT : u.INT,
    t,
    s,
    i.slice(t, s)
  );
}
function ze(e, t, n) {
  if (!Ae(n))
    throw x(
      e.source,
      t,
      `Invalid number, expected digit but got: ${re(
        e,
        t
      )}.`
    );
  const i = e.source.body;
  let s = t + 1;
  for (; Ae(i.charCodeAt(s)); )
    ++s;
  return s;
}
function Xn(e, t) {
  const n = e.source.body, i = n.length;
  let s = t + 1, r = s, a = "";
  for (; s < i; ) {
    const c = n.charCodeAt(s);
    if (c === 34)
      return a += n.slice(r, s), b(e, u.STRING, t, s + 1, a);
    if (c === 92) {
      a += n.slice(r, s);
      const l = n.charCodeAt(s + 1) === 117 ? n.charCodeAt(s + 2) === 123 ? qn(e, s) : Wn(e, s) : Zn(e, s);
      a += l.value, s += l.size, r = s;
      continue;
    }
    if (c === 10 || c === 13)
      break;
    if (me(c))
      ++s;
    else if (je(n, s))
      s += 2;
    else
      throw x(
        e.source,
        s,
        `Invalid character within String: ${re(
          e,
          s
        )}.`
      );
  }
  throw x(e.source, s, "Unterminated string.");
}
function qn(e, t) {
  const n = e.source.body;
  let i = 0, s = 3;
  for (; s < 12; ) {
    const r = n.charCodeAt(t + s++);
    if (r === 125) {
      if (s < 5 || !me(i))
        break;
      return {
        value: String.fromCodePoint(i),
        size: s
      };
    }
    if (i = i << 4 | Ie(r), i < 0)
      break;
  }
  throw x(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(
      t,
      t + s
    )}".`
  );
}
function Wn(e, t) {
  const n = e.source.body, i = Ot(n, t + 2);
  if (me(i))
    return {
      value: String.fromCodePoint(i),
      size: 6
    };
  if (Ht(i) && n.charCodeAt(t + 6) === 92 && n.charCodeAt(t + 7) === 117) {
    const s = Ot(n, t + 8);
    if (zt(s))
      return {
        value: String.fromCodePoint(i, s),
        size: 12
      };
  }
  throw x(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(t, t + 6)}".`
  );
}
function Ot(e, t) {
  return Ie(e.charCodeAt(t)) << 12 | Ie(e.charCodeAt(t + 1)) << 8 | Ie(e.charCodeAt(t + 2)) << 4 | Ie(e.charCodeAt(t + 3));
}
function Ie(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 55 : e >= 97 && e <= 102 ? e - 87 : -1;
}
function Zn(e, t) {
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
  throw x(
    e.source,
    t,
    `Invalid character escape sequence: "${n.slice(
      t,
      t + 2
    )}".`
  );
}
function Kn(e, t) {
  const n = e.source.body, i = n.length;
  let s = e.lineStart, r = t + 3, a = r, c = "";
  const l = [];
  for (; r < i; ) {
    const p = n.charCodeAt(r);
    if (p === 34 && n.charCodeAt(r + 1) === 34 && n.charCodeAt(r + 2) === 34) {
      c += n.slice(a, r), l.push(c);
      const d = b(
        e,
        u.BLOCK_STRING,
        t,
        r + 3,
        // Return a string of the lines joined with U+000A.
        Vn(l).join(`
`)
      );
      return e.line += l.length - 1, e.lineStart = s, d;
    }
    if (p === 92 && n.charCodeAt(r + 1) === 34 && n.charCodeAt(r + 2) === 34 && n.charCodeAt(r + 3) === 34) {
      c += n.slice(a, r), a = r + 1, r += 4;
      continue;
    }
    if (p === 10 || p === 13) {
      c += n.slice(a, r), l.push(c), p === 13 && n.charCodeAt(r + 1) === 10 ? r += 2 : ++r, c = "", a = r, s = r;
      continue;
    }
    if (me(p))
      ++r;
    else if (je(n, r))
      r += 2;
    else
      throw x(
        e.source,
        r,
        `Invalid character within String: ${re(
          e,
          r
        )}.`
      );
  }
  throw x(e.source, r, "Unterminated string.");
}
function ei(e, t) {
  const n = e.source.body, i = n.length;
  let s = t + 1;
  for (; s < i; ) {
    const r = n.charCodeAt(s);
    if (Jt(r))
      ++s;
    else
      break;
  }
  return b(
    e,
    u.NAME,
    t,
    s,
    n.slice(t, s)
  );
}
const ti = 10, Xt = 2;
function _(e) {
  return Be(e, []);
}
function Be(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return ni(e, t);
    default:
      return String(e);
  }
}
function ni(e, t) {
  if (e === null)
    return "null";
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (ii(e)) {
    const i = e.toJSON();
    if (i !== e)
      return typeof i == "string" ? i : Be(i, n);
  } else if (Array.isArray(e))
    return ri(e, n);
  return si(e, n);
}
function ii(e) {
  return typeof e.toJSON == "function";
}
function si(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > Xt ? "[" + oi(e) + "]" : "{ " + n.map(
    ([s, r]) => s + ": " + Be(r, t)
  ).join(", ") + " }";
}
function ri(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > Xt)
    return "[Array]";
  const n = Math.min(ti, e.length), i = e.length - n, s = [];
  for (let r = 0; r < n; ++r)
    s.push(Be(e[r], t));
  return i === 1 ? s.push("... 1 more item") : i > 1 && s.push(`... ${i} more items`), "[" + s.join(", ") + "]";
}
function oi(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
const ai = globalThis.process && // eslint-disable-next-line no-undef
process.env.NODE_ENV === "production", G = (
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  ai ? function(t, n) {
    return t instanceof n;
  } : function(t, n) {
    if (t instanceof n)
      return !0;
    if (typeof t == "object" && t !== null) {
      var i;
      const s = n.prototype[Symbol.toStringTag], r = (
        // We still need to support constructor's name to detect conflicts with older versions of this library.
        Symbol.toStringTag in t ? t[Symbol.toStringTag] : (i = t.constructor) === null || i === void 0 ? void 0 : i.name
      );
      if (s === r) {
        const a = _(t);
        throw new Error(`Cannot use ${s} "${a}" from another module or realm.

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
class ut {
  constructor(t, n = "GraphQL request", i = {
    line: 1,
    column: 1
  }) {
    typeof t == "string" || g(!1, `Body must be a string. Received: ${_(t)}.`), this.body = t, this.name = n, this.locationOffset = i, this.locationOffset.line > 0 || g(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || g(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function ci(e) {
  return G(e, ut);
}
function qt(e, t) {
  return new ui(e, t).parseDocument();
}
class ui {
  constructor(t, n = {}) {
    const i = ci(t) ? t : new ut(t);
    this._lexer = new Yn(i), this._options = n, this._tokenCounter = 0;
  }
  /**
   * Converts a name lex token into a name parse node.
   */
  parseName() {
    const t = this.expectToken(u.NAME);
    return this.node(t, {
      kind: o.NAME,
      value: t.value
    });
  }
  // Implements the parsing rules in the Document section.
  /**
   * Document : Definition+
   */
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: o.DOCUMENT,
      definitions: this.many(
        u.SOF,
        this.parseDefinition,
        u.EOF
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
    if (this.peek(u.BRACE_L))
      return this.parseOperationDefinition();
    const t = this.peekDescription(), n = t ? this._lexer.lookahead() : this._lexer.token;
    if (n.kind === u.NAME) {
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
        throw x(
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
    if (this.peek(u.BRACE_L))
      return this.node(t, {
        kind: o.OPERATION_DEFINITION,
        operation: J.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const n = this.parseOperationType();
    let i;
    return this.peek(u.NAME) && (i = this.parseName()), this.node(t, {
      kind: o.OPERATION_DEFINITION,
      operation: n,
      name: i,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  /**
   * OperationType : one of query mutation subscription
   */
  parseOperationType() {
    const t = this.expectToken(u.NAME);
    switch (t.value) {
      case "query":
        return J.QUERY;
      case "mutation":
        return J.MUTATION;
      case "subscription":
        return J.SUBSCRIPTION;
    }
    throw this.unexpected(t);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  parseVariableDefinitions() {
    return this.optionalMany(
      u.PAREN_L,
      this.parseVariableDefinition,
      u.PAREN_R
    );
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: o.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(u.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(u.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  /**
   * Variable : $ Name
   */
  parseVariable() {
    const t = this._lexer.token;
    return this.expectToken(u.DOLLAR), this.node(t, {
      kind: o.VARIABLE,
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
      kind: o.SELECTION_SET,
      selections: this.many(
        u.BRACE_L,
        this.parseSelection,
        u.BRACE_R
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
    return this.peek(u.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  parseField() {
    const t = this._lexer.token, n = this.parseName();
    let i, s;
    return this.expectOptionalToken(u.COLON) ? (i = n, s = this.parseName()) : s = n, this.node(t, {
      kind: o.FIELD,
      alias: i,
      name: s,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(u.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  parseArguments(t) {
    const n = t ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(u.PAREN_L, n, u.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  parseArgument(t = !1) {
    const n = this._lexer.token, i = this.parseName();
    return this.expectToken(u.COLON), this.node(n, {
      kind: o.ARGUMENT,
      name: i,
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
    this.expectToken(u.SPREAD);
    const n = this.expectOptionalKeyword("on");
    return !n && this.peek(u.NAME) ? this.node(t, {
      kind: o.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(t, {
      kind: o.INLINE_FRAGMENT,
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
      kind: o.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(t, {
      kind: o.FRAGMENT_DEFINITION,
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
      case u.BRACKET_L:
        return this.parseList(t);
      case u.BRACE_L:
        return this.parseObject(t);
      case u.INT:
        return this.advanceLexer(), this.node(n, {
          kind: o.INT,
          value: n.value
        });
      case u.FLOAT:
        return this.advanceLexer(), this.node(n, {
          kind: o.FLOAT,
          value: n.value
        });
      case u.STRING:
      case u.BLOCK_STRING:
        return this.parseStringLiteral();
      case u.NAME:
        switch (this.advanceLexer(), n.value) {
          case "true":
            return this.node(n, {
              kind: o.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(n, {
              kind: o.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(n, {
              kind: o.NULL
            });
          default:
            return this.node(n, {
              kind: o.ENUM,
              value: n.value
            });
        }
      case u.DOLLAR:
        if (t)
          if (this.expectToken(u.DOLLAR), this._lexer.token.kind === u.NAME) {
            const i = this._lexer.token.value;
            throw x(
              this._lexer.source,
              n.start,
              `Unexpected variable "$${i}" in constant value.`
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
      kind: o.STRING,
      value: t.value,
      block: t.kind === u.BLOCK_STRING
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
      kind: o.LIST,
      values: this.any(u.BRACKET_L, n, u.BRACKET_R)
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
      kind: o.OBJECT,
      fields: this.any(u.BRACE_L, n, u.BRACE_R)
    });
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  parseObjectField(t) {
    const n = this._lexer.token, i = this.parseName();
    return this.expectToken(u.COLON), this.node(n, {
      kind: o.OBJECT_FIELD,
      name: i,
      value: this.parseValueLiteral(t)
    });
  }
  // Implements the parsing rules in the Directives section.
  /**
   * Directives[Const] : Directive[?Const]+
   */
  parseDirectives(t) {
    const n = [];
    for (; this.peek(u.AT); )
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
    return this.expectToken(u.AT), this.node(n, {
      kind: o.DIRECTIVE,
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
    if (this.expectOptionalToken(u.BRACKET_L)) {
      const i = this.parseTypeReference();
      this.expectToken(u.BRACKET_R), n = this.node(t, {
        kind: o.LIST_TYPE,
        type: i
      });
    } else
      n = this.parseNamedType();
    return this.expectOptionalToken(u.BANG) ? this.node(t, {
      kind: o.NON_NULL_TYPE,
      type: n
    }) : n;
  }
  /**
   * NamedType : Name
   */
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: o.NAMED_TYPE,
      name: this.parseName()
    });
  }
  // Implements the parsing rules in the Type Definition section.
  peekDescription() {
    return this.peek(u.STRING) || this.peek(u.BLOCK_STRING);
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
    const i = this.parseConstDirectives(), s = this.many(
      u.BRACE_L,
      this.parseOperationTypeDefinition,
      u.BRACE_R
    );
    return this.node(t, {
      kind: o.SCHEMA_DEFINITION,
      description: n,
      directives: i,
      operationTypes: s
    });
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  parseOperationTypeDefinition() {
    const t = this._lexer.token, n = this.parseOperationType();
    this.expectToken(u.COLON);
    const i = this.parseNamedType();
    return this.node(t, {
      kind: o.OPERATION_TYPE_DEFINITION,
      operation: n,
      type: i
    });
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  parseScalarTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("scalar");
    const i = this.parseName(), s = this.parseConstDirectives();
    return this.node(t, {
      kind: o.SCALAR_TYPE_DEFINITION,
      description: n,
      name: i,
      directives: s
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
    const i = this.parseName(), s = this.parseImplementsInterfaces(), r = this.parseConstDirectives(), a = this.parseFieldsDefinition();
    return this.node(t, {
      kind: o.OBJECT_TYPE_DEFINITION,
      description: n,
      name: i,
      interfaces: s,
      directives: r,
      fields: a
    });
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(u.AMP, this.parseNamedType) : [];
  }
  /**
   * ```
   * FieldsDefinition : { FieldDefinition+ }
   * ```
   */
  parseFieldsDefinition() {
    return this.optionalMany(
      u.BRACE_L,
      this.parseFieldDefinition,
      u.BRACE_R
    );
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  parseFieldDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), i = this.parseName(), s = this.parseArgumentDefs();
    this.expectToken(u.COLON);
    const r = this.parseTypeReference(), a = this.parseConstDirectives();
    return this.node(t, {
      kind: o.FIELD_DEFINITION,
      description: n,
      name: i,
      arguments: s,
      type: r,
      directives: a
    });
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  parseArgumentDefs() {
    return this.optionalMany(
      u.PAREN_L,
      this.parseInputValueDef,
      u.PAREN_R
    );
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  parseInputValueDef() {
    const t = this._lexer.token, n = this.parseDescription(), i = this.parseName();
    this.expectToken(u.COLON);
    const s = this.parseTypeReference();
    let r;
    this.expectOptionalToken(u.EQUALS) && (r = this.parseConstValueLiteral());
    const a = this.parseConstDirectives();
    return this.node(t, {
      kind: o.INPUT_VALUE_DEFINITION,
      description: n,
      name: i,
      type: s,
      defaultValue: r,
      directives: a
    });
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  parseInterfaceTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("interface");
    const i = this.parseName(), s = this.parseImplementsInterfaces(), r = this.parseConstDirectives(), a = this.parseFieldsDefinition();
    return this.node(t, {
      kind: o.INTERFACE_TYPE_DEFINITION,
      description: n,
      name: i,
      interfaces: s,
      directives: r,
      fields: a
    });
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  parseUnionTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("union");
    const i = this.parseName(), s = this.parseConstDirectives(), r = this.parseUnionMemberTypes();
    return this.node(t, {
      kind: o.UNION_TYPE_DEFINITION,
      description: n,
      name: i,
      directives: s,
      types: r
    });
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  parseUnionMemberTypes() {
    return this.expectOptionalToken(u.EQUALS) ? this.delimitedMany(u.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  parseEnumTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("enum");
    const i = this.parseName(), s = this.parseConstDirectives(), r = this.parseEnumValuesDefinition();
    return this.node(t, {
      kind: o.ENUM_TYPE_DEFINITION,
      description: n,
      name: i,
      directives: s,
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
      u.BRACE_L,
      this.parseEnumValueDefinition,
      u.BRACE_R
    );
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   */
  parseEnumValueDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), i = this.parseEnumValueName(), s = this.parseConstDirectives();
    return this.node(t, {
      kind: o.ENUM_VALUE_DEFINITION,
      description: n,
      name: i,
      directives: s
    });
  }
  /**
   * EnumValue : Name but not `true`, `false` or `null`
   */
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null")
      throw x(
        this._lexer.source,
        this._lexer.token.start,
        `${xe(
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
    const i = this.parseName(), s = this.parseConstDirectives(), r = this.parseInputFieldsDefinition();
    return this.node(t, {
      kind: o.INPUT_OBJECT_TYPE_DEFINITION,
      description: n,
      name: i,
      directives: s,
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
      u.BRACE_L,
      this.parseInputValueDef,
      u.BRACE_R
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
    if (t.kind === u.NAME)
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
    const n = this.parseConstDirectives(), i = this.optionalMany(
      u.BRACE_L,
      this.parseOperationTypeDefinition,
      u.BRACE_R
    );
    if (n.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: o.SCHEMA_EXTENSION,
      directives: n,
      operationTypes: i
    });
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  parseScalarTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("scalar");
    const n = this.parseName(), i = this.parseConstDirectives();
    if (i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: o.SCALAR_TYPE_EXTENSION,
      name: n,
      directives: i
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
    const n = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), r = this.parseFieldsDefinition();
    if (i.length === 0 && s.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: o.OBJECT_TYPE_EXTENSION,
      name: n,
      interfaces: i,
      directives: s,
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
    const n = this.parseName(), i = this.parseImplementsInterfaces(), s = this.parseConstDirectives(), r = this.parseFieldsDefinition();
    if (i.length === 0 && s.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: o.INTERFACE_TYPE_EXTENSION,
      name: n,
      interfaces: i,
      directives: s,
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
    const n = this.parseName(), i = this.parseConstDirectives(), s = this.parseUnionMemberTypes();
    if (i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: o.UNION_TYPE_EXTENSION,
      name: n,
      directives: i,
      types: s
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
    const n = this.parseName(), i = this.parseConstDirectives(), s = this.parseEnumValuesDefinition();
    if (i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: o.ENUM_TYPE_EXTENSION,
      name: n,
      directives: i,
      values: s
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
    const n = this.parseName(), i = this.parseConstDirectives(), s = this.parseInputFieldsDefinition();
    if (i.length === 0 && s.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: o.INPUT_OBJECT_TYPE_EXTENSION,
      name: n,
      directives: i,
      fields: s
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
    this.expectKeyword("directive"), this.expectToken(u.AT);
    const i = this.parseName(), s = this.parseArgumentDefs(), r = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const a = this.parseDirectiveLocations();
    return this.node(t, {
      kind: o.DIRECTIVE_DEFINITION,
      description: n,
      name: i,
      arguments: s,
      repeatable: r,
      locations: a
    });
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  parseDirectiveLocations() {
    return this.delimitedMany(u.PIPE, this.parseDirectiveLocation);
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
    if (Object.prototype.hasOwnProperty.call(E, n.value))
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
    return this._options.noLocation !== !0 && (n.loc = new jn(
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
    throw x(
      this._lexer.source,
      n.start,
      `Expected ${Wt(t)}, found ${xe(n)}.`
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
    if (n.kind === u.NAME && n.value === t)
      this.advanceLexer();
    else
      throw x(
        this._lexer.source,
        n.start,
        `Expected "${t}", found ${xe(n)}.`
      );
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  expectOptionalKeyword(t) {
    const n = this._lexer.token;
    return n.kind === u.NAME && n.value === t ? (this.advanceLexer(), !0) : !1;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  unexpected(t) {
    const n = t ?? this._lexer.token;
    return x(
      this._lexer.source,
      n.start,
      `Unexpected ${xe(n)}.`
    );
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  any(t, n, i) {
    this.expectToken(t);
    const s = [];
    for (; !this.expectOptionalToken(i); )
      s.push(n.call(this));
    return s;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  optionalMany(t, n, i) {
    if (this.expectOptionalToken(t)) {
      const s = [];
      do
        s.push(n.call(this));
      while (!this.expectOptionalToken(i));
      return s;
    }
    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  many(t, n, i) {
    this.expectToken(t);
    const s = [];
    do
      s.push(n.call(this));
    while (!this.expectOptionalToken(i));
    return s;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  delimitedMany(t, n) {
    this.expectOptionalToken(t);
    const i = [];
    do
      i.push(n.call(this));
    while (this.expectOptionalToken(t));
    return i;
  }
  advanceLexer() {
    const { maxTokens: t } = this._options, n = this._lexer.advance();
    if (t !== void 0 && n.kind !== u.EOF && (++this._tokenCounter, this._tokenCounter > t))
      throw x(
        this._lexer.source,
        n.start,
        `Document contains more that ${t} tokens. Parsing aborted.`
      );
  }
}
function xe(e) {
  const t = e.value;
  return Wt(e.kind) + (t != null ? ` "${t}"` : "");
}
function Wt(e) {
  return Qn(e) ? `"${e}"` : e;
}
const li = 5;
function pi(e, t) {
  const [n, i] = t ? [e, t] : [void 0, e];
  let s = " Did you mean ";
  n && (s += n + " ");
  const r = i.map((l) => `"${l}"`);
  switch (r.length) {
    case 0:
      return "";
    case 1:
      return s + r[0] + "?";
    case 2:
      return s + r[0] + " or " + r[1] + "?";
  }
  const a = r.slice(0, li), c = a.pop();
  return s + a.join(", ") + ", or " + c + "?";
}
function St(e) {
  return e;
}
function di(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const i of e)
    n[t(i)] = i;
  return n;
}
function lt(e, t, n) {
  const i = /* @__PURE__ */ Object.create(null);
  for (const s of e)
    i[t(s)] = n(s);
  return i;
}
function Ve(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const i of Object.keys(e))
    n[i] = t(e[i], i);
  return n;
}
function fi(e, t) {
  let n = 0, i = 0;
  for (; n < e.length && i < t.length; ) {
    let s = e.charCodeAt(n), r = t.charCodeAt(i);
    if (ke(s) && ke(r)) {
      let a = 0;
      do
        ++n, a = a * 10 + s - Ke, s = e.charCodeAt(n);
      while (ke(s) && a > 0);
      let c = 0;
      do
        ++i, c = c * 10 + r - Ke, r = t.charCodeAt(i);
      while (ke(r) && c > 0);
      if (a < c)
        return -1;
      if (a > c)
        return 1;
    } else {
      if (s < r)
        return -1;
      if (s > r)
        return 1;
      ++n, ++i;
    }
  }
  return e.length - t.length;
}
const Ke = 48, hi = 57;
function ke(e) {
  return !isNaN(e) && Ke <= e && e <= hi;
}
function mi(e, t) {
  const n = /* @__PURE__ */ Object.create(null), i = new Ti(e), s = Math.floor(e.length * 0.4) + 1;
  for (const r of t) {
    const a = i.measure(r, s);
    a !== void 0 && (n[r] = a);
  }
  return Object.keys(n).sort((r, a) => {
    const c = n[r] - n[a];
    return c !== 0 ? c : fi(r, a);
  });
}
class Ti {
  constructor(t) {
    this._input = t, this._inputLowerCase = t.toLowerCase(), this._inputArray = bt(this._inputLowerCase), this._rows = [
      new Array(t.length + 1).fill(0),
      new Array(t.length + 1).fill(0),
      new Array(t.length + 1).fill(0)
    ];
  }
  measure(t, n) {
    if (this._input === t)
      return 0;
    const i = t.toLowerCase();
    if (this._inputLowerCase === i)
      return 1;
    let s = bt(i), r = this._inputArray;
    if (s.length < r.length) {
      const d = s;
      s = r, r = d;
    }
    const a = s.length, c = r.length;
    if (a - c > n)
      return;
    const l = this._rows;
    for (let d = 0; d <= c; d++)
      l[0][d] = d;
    for (let d = 1; d <= a; d++) {
      const m = l[(d - 1) % 3], N = l[d % 3];
      let A = N[0] = d;
      for (let v = 1; v <= c; v++) {
        const L = s[d - 1] === r[v - 1] ? 0 : 1;
        let U = Math.min(
          m[v] + 1,
          // delete
          N[v - 1] + 1,
          // insert
          m[v - 1] + L
          // substitute
        );
        if (d > 1 && v > 1 && s[d - 1] === r[v - 2] && s[d - 2] === r[v - 1]) {
          const w = l[(d - 2) % 3][v - 2];
          U = Math.min(U, w + 1);
        }
        U < A && (A = U), N[v] = U;
      }
      if (A > n)
        return;
    }
    const p = l[a % 3][c];
    return p <= n ? p : void 0;
  }
}
function bt(e) {
  const t = e.length, n = new Array(t);
  for (let i = 0; i < t; ++i)
    n[i] = e.charCodeAt(i);
  return n;
}
function F(e) {
  if (e == null)
    return /* @__PURE__ */ Object.create(null);
  if (Object.getPrototypeOf(e) === null)
    return e;
  const t = /* @__PURE__ */ Object.create(null);
  for (const [n, i] of Object.entries(e))
    t[n] = i;
  return t;
}
function vi(e) {
  return `"${e.replace(Ei, yi)}"`;
}
const Ei = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function yi(e) {
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
], Ii = Object.freeze({});
function Zt(e, t, n = Yt) {
  const i = /* @__PURE__ */ new Map();
  for (const w of Object.values(o))
    i.set(w, gi(t, w));
  let s, r = Array.isArray(e), a = [e], c = -1, l = [], p = e, d, m;
  const N = [], A = [];
  do {
    c++;
    const w = c === a.length, Et = w && l.length !== 0;
    if (w) {
      if (d = A.length === 0 ? void 0 : N[N.length - 1], p = m, m = A.pop(), Et)
        if (r) {
          p = p.slice();
          let q = 0;
          for (const [He, yt] of l) {
            const Nt = He - q;
            yt === null ? (p.splice(Nt, 1), q++) : p[Nt] = yt;
          }
        } else {
          p = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(p)
          );
          for (const [q, He] of l)
            p[q] = He;
        }
      c = s.index, a = s.keys, l = s.edits, r = s.inArray, s = s.prev;
    } else if (m) {
      if (d = r ? c : a[c], p = m[d], p == null)
        continue;
      N.push(d);
    }
    let X;
    if (!Array.isArray(p)) {
      var v, L;
      _t(p) || g(!1, `Invalid AST Node: ${_(p)}.`);
      const q = w ? (v = i.get(p.kind)) === null || v === void 0 ? void 0 : v.leave : (L = i.get(p.kind)) === null || L === void 0 ? void 0 : L.enter;
      if (X = q?.call(t, p, d, m, N, A), X === Ii)
        break;
      if (X === !1) {
        if (!w) {
          N.pop();
          continue;
        }
      } else if (X !== void 0 && (l.push([d, X]), !w))
        if (_t(X))
          p = X;
        else {
          N.pop();
          continue;
        }
    }
    if (X === void 0 && Et && l.push([d, p]), w)
      N.pop();
    else {
      var U;
      s = {
        inArray: r,
        index: c,
        keys: a,
        edits: l,
        prev: s
      }, r = Array.isArray(p), a = r ? p : (U = n[p.kind]) !== null && U !== void 0 ? U : [], c = -1, l = [], m && A.push(m), m = p;
    }
  } while (s !== void 0);
  return l.length !== 0 ? l[l.length - 1][1] : e;
}
function gi(e, t) {
  const n = e[t];
  return typeof n == "object" ? n : typeof n == "function" ? {
    enter: n,
    leave: void 0
  } : {
    enter: e.enter,
    leave: e.leave
  };
}
function K(e) {
  return Zt(e, Oi);
}
const _i = 80, Oi = {
  Name: {
    leave: (e) => e.value
  },
  Variable: {
    leave: (e) => "$" + e.name
  },
  // Document
  Document: {
    leave: (e) => h(e.definitions, `

`)
  },
  OperationDefinition: {
    leave(e) {
      const t = T("(", h(e.variableDefinitions, ", "), ")"), n = h(
        [
          e.operation,
          h([e.name, t]),
          h(e.directives, " ")
        ],
        " "
      );
      return (n === "query" ? "" : n + " ") + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: i }) => e + ": " + t + T(" = ", n) + T(" ", h(i, " "))
  },
  SelectionSet: {
    leave: ({ selections: e }) => M(e)
  },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: i, selectionSet: s }) {
      const r = T("", e, ": ") + t;
      let a = r + T("(", h(n, ", "), ")");
      return a.length > _i && (a = r + T(`(
`, Re(h(n, `
`)), `
)`)), h([a, h(i, " "), s], " ");
    }
  },
  Argument: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + T(" ", h(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => h(
      [
        "...",
        T("on ", e),
        h(t, " "),
        n
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: i, selectionSet: s }) => (
      // or removed in the future.
      `fragment ${e}${T("(", h(n, ", "), ")")} on ${t} ${T("", h(i, " "), " ")}` + s
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
    leave: ({ value: e, block: t }) => t ? Gn(e) : vi(e)
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
    leave: ({ values: e }) => "[" + h(e, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: e }) => "{" + h(e, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + T("(", h(t, ", "), ")")
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
`) + h(["schema", h(t, " "), M(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ description: e, name: t, directives: n }) => T("", e, `
`) + h(["scalar", t, h(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: i, fields: s }) => T("", e, `
`) + h(
      [
        "type",
        t,
        T("implements ", h(n, " & ")),
        h(i, " "),
        M(s)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: e, name: t, arguments: n, type: i, directives: s }) => T("", e, `
`) + t + (At(n) ? T(`(
`, Re(h(n, `
`)), `
)`) : T("(", h(n, ", "), ")")) + ": " + i + T(" ", h(s, " "))
  },
  InputValueDefinition: {
    leave: ({ description: e, name: t, type: n, defaultValue: i, directives: s }) => T("", e, `
`) + h(
      [t + ": " + n, T("= ", i), h(s, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: i, fields: s }) => T("", e, `
`) + h(
      [
        "interface",
        t,
        T("implements ", h(n, " & ")),
        h(i, " "),
        M(s)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, types: i }) => T("", e, `
`) + h(
      ["union", t, h(n, " "), T("= ", h(i, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, values: i }) => T("", e, `
`) + h(["enum", t, h(n, " "), M(i)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: e, name: t, directives: n }) => T("", e, `
`) + h([t, h(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, fields: i }) => T("", e, `
`) + h(["input", t, h(n, " "), M(i)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: e, name: t, arguments: n, repeatable: i, locations: s }) => T("", e, `
`) + "directive @" + t + (At(n) ? T(`(
`, Re(h(n, `
`)), `
)`) : T("(", h(n, ", "), ")")) + (i ? " repeatable" : "") + " on " + h(s, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => h(
      ["extend schema", h(e, " "), M(t)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => h(["extend scalar", e, h(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: i }) => h(
      [
        "extend type",
        e,
        T("implements ", h(t, " & ")),
        h(n, " "),
        M(i)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: i }) => h(
      [
        "extend interface",
        e,
        T("implements ", h(t, " & ")),
        h(n, " "),
        M(i)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => h(
      [
        "extend union",
        e,
        h(t, " "),
        T("= ", h(n, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => h(["extend enum", e, h(t, " "), M(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => h(["extend input", e, h(t, " "), M(n)], " ")
  }
};
function h(e, t = "") {
  var n;
  return (n = e?.filter((i) => i).join(t)) !== null && n !== void 0 ? n : "";
}
function M(e) {
  return T(`{
`, Re(h(e, `
`)), `
}`);
}
function T(e, t, n = "") {
  return t != null && t !== "" ? e + t + n : "";
}
function Re(e) {
  return T("  ", e.replace(/\n/g, `
  `));
}
function At(e) {
  var t;
  return (t = e?.some((n) => n.includes(`
`))) !== null && t !== void 0 ? t : !1;
}
function et(e, t) {
  switch (e.kind) {
    case o.NULL:
      return null;
    case o.INT:
      return parseInt(e.value, 10);
    case o.FLOAT:
      return parseFloat(e.value);
    case o.STRING:
    case o.ENUM:
    case o.BOOLEAN:
      return e.value;
    case o.LIST:
      return e.values.map(
        (n) => et(n, t)
      );
    case o.OBJECT:
      return lt(
        e.fields,
        (n) => n.name.value,
        (n) => et(n.value, t)
      );
    case o.VARIABLE:
      return t?.[e.name.value];
  }
}
function Y(e) {
  if (e != null || g(!1, "Must provide name."), typeof e == "string" || g(!1, "Expected name to be a string."), e.length === 0)
    throw new I("Expected name to be a non-empty string.");
  for (let t = 1; t < e.length; ++t)
    if (!Jt(e.charCodeAt(t)))
      throw new I(
        `Names must only contain [_a-zA-Z0-9] but "${e}" does not.`
      );
  if (!ct(e.charCodeAt(0)))
    throw new I(
      `Names must start with [_a-zA-Z] but "${e}" does not.`
    );
  return e;
}
function Si(e) {
  if (e === "true" || e === "false" || e === "null")
    throw new I(`Enum values cannot be named: ${e}`);
  return Y(e);
}
function Kt(e) {
  return $e(e) || ie(e) || Q(e) || oe(e) || ae(e) || Z(e) || Te(e) || ce(e);
}
function $e(e) {
  return G(e, ve);
}
function ie(e) {
  return G(e, ue);
}
function Q(e) {
  return G(e, ki);
}
function oe(e) {
  return G(e, Li);
}
function ae(e) {
  return G(e, pt);
}
function Z(e) {
  return G(e, Ri);
}
function Te(e) {
  return G(e, B);
}
function ce(e) {
  return G(e, y);
}
function en(e) {
  return $e(e) || ae(e);
}
function bi(e) {
  return Q(e) || oe(e);
}
class B {
  constructor(t) {
    Kt(t) || g(!1, `Expected ${_(t)} to be a GraphQL type.`), this.ofType = t;
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
class y {
  constructor(t) {
    Di(t) || g(
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
function Ai(e) {
  return Te(e) || ce(e);
}
function Di(e) {
  return Kt(e) && !ce(e);
}
function xi(e) {
  if (e) {
    let t = e;
    for (; Ai(t); )
      t = t.ofType;
    return t;
  }
}
function tn(e) {
  return typeof e == "function" ? e() : e;
}
function nn(e) {
  return typeof e == "function" ? e() : e;
}
class ve {
  constructor(t) {
    var n, i, s, r;
    const a = (n = t.parseValue) !== null && n !== void 0 ? n : St;
    this.name = Y(t.name), this.description = t.description, this.specifiedByURL = t.specifiedByURL, this.serialize = (i = t.serialize) !== null && i !== void 0 ? i : St, this.parseValue = a, this.parseLiteral = (s = t.parseLiteral) !== null && s !== void 0 ? s : (c, l) => a(et(c, l)), this.extensions = F(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (r = t.extensionASTNodes) !== null && r !== void 0 ? r : [], t.specifiedByURL == null || typeof t.specifiedByURL == "string" || g(
      !1,
      `${this.name} must provide "specifiedByURL" as a string, but got: ${_(t.specifiedByURL)}.`
    ), t.serialize == null || typeof t.serialize == "function" || g(
      !1,
      `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`
    ), t.parseLiteral && (typeof t.parseValue == "function" && typeof t.parseLiteral == "function" || g(
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
class ue {
  constructor(t) {
    var n;
    this.name = Y(t.name), this.description = t.description, this.isTypeOf = t.isTypeOf, this.extensions = F(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._fields = () => rn(t), this._interfaces = () => sn(t), t.isTypeOf == null || typeof t.isTypeOf == "function" || g(
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
      fields: an(this.getFields()),
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
function sn(e) {
  var t;
  const n = tn(
    (t = e.interfaces) !== null && t !== void 0 ? t : []
  );
  return Array.isArray(n) || g(
    !1,
    `${e.name} interfaces must be an Array or a function which returns an Array.`
  ), n;
}
function rn(e) {
  const t = nn(e.fields);
  return de(t) || g(
    !1,
    `${e.name} fields must be an object with field names as keys or a function which returns such an object.`
  ), Ve(t, (n, i) => {
    var s;
    de(n) || g(
      !1,
      `${e.name}.${i} field config must be an object.`
    ), n.resolve == null || typeof n.resolve == "function" || g(
      !1,
      `${e.name}.${i} field resolver must be a function if provided, but got: ${_(n.resolve)}.`
    );
    const r = (s = n.args) !== null && s !== void 0 ? s : {};
    return de(r) || g(
      !1,
      `${e.name}.${i} args must be an object with argument names as keys.`
    ), {
      name: Y(i),
      description: n.description,
      type: n.type,
      args: on(r),
      resolve: n.resolve,
      subscribe: n.subscribe,
      deprecationReason: n.deprecationReason,
      extensions: F(n.extensions),
      astNode: n.astNode
    };
  });
}
function on(e) {
  return Object.entries(e).map(([t, n]) => ({
    name: Y(t),
    description: n.description,
    type: n.type,
    defaultValue: n.defaultValue,
    deprecationReason: n.deprecationReason,
    extensions: F(n.extensions),
    astNode: n.astNode
  }));
}
function de(e) {
  return se(e) && !Array.isArray(e);
}
function an(e) {
  return Ve(e, (t) => ({
    description: t.description,
    type: t.type,
    args: cn(t.args),
    resolve: t.resolve,
    subscribe: t.subscribe,
    deprecationReason: t.deprecationReason,
    extensions: t.extensions,
    astNode: t.astNode
  }));
}
function cn(e) {
  return lt(
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
class ki {
  constructor(t) {
    var n;
    this.name = Y(t.name), this.description = t.description, this.resolveType = t.resolveType, this.extensions = F(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._fields = rn.bind(void 0, t), this._interfaces = sn.bind(void 0, t), t.resolveType == null || typeof t.resolveType == "function" || g(
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
      fields: an(this.getFields()),
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
    this.name = Y(t.name), this.description = t.description, this.resolveType = t.resolveType, this.extensions = F(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._types = wi.bind(void 0, t), t.resolveType == null || typeof t.resolveType == "function" || g(
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
function wi(e) {
  const t = tn(e.types);
  return Array.isArray(t) || g(
    !1,
    `Must provide Array of types or a function which returns such an array for Union ${e.name}.`
  ), t;
}
class pt {
  /* <T> */
  constructor(t) {
    var n;
    this.name = Y(t.name), this.description = t.description, this.extensions = F(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._values = typeof t.values == "function" ? t.values : Dt(this.name, t.values), this._valueLookup = null, this._nameLookup = null;
  }
  get [Symbol.toStringTag]() {
    return "GraphQLEnumType";
  }
  getValues() {
    return typeof this._values == "function" && (this._values = Dt(this.name, this._values())), this._values;
  }
  getValue(t) {
    return this._nameLookup === null && (this._nameLookup = di(this.getValues(), (n) => n.name)), this._nameLookup[t];
  }
  serialize(t) {
    this._valueLookup === null && (this._valueLookup = new Map(
      this.getValues().map((i) => [i.value, i])
    ));
    const n = this._valueLookup.get(t);
    if (n === void 0)
      throw new I(
        `Enum "${this.name}" cannot represent value: ${_(t)}`
      );
    return n.name;
  }
  parseValue(t) {
    if (typeof t != "string") {
      const i = _(t);
      throw new I(
        `Enum "${this.name}" cannot represent non-string value: ${i}.` + Le(this, i)
      );
    }
    const n = this.getValue(t);
    if (n == null)
      throw new I(
        `Value "${t}" does not exist in "${this.name}" enum.` + Le(this, t)
      );
    return n.value;
  }
  parseLiteral(t, n) {
    if (t.kind !== o.ENUM) {
      const s = K(t);
      throw new I(
        `Enum "${this.name}" cannot represent non-enum value: ${s}.` + Le(this, s),
        {
          nodes: t
        }
      );
    }
    const i = this.getValue(t.value);
    if (i == null) {
      const s = K(t);
      throw new I(
        `Value "${s}" does not exist in "${this.name}" enum.` + Le(this, s),
        {
          nodes: t
        }
      );
    }
    return i.value;
  }
  toConfig() {
    const t = lt(
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
function Le(e, t) {
  const n = e.getValues().map((s) => s.name), i = mi(t, n);
  return pi("the enum value", i);
}
function Dt(e, t) {
  return de(t) || g(
    !1,
    `${e} values must be an object with value names as keys.`
  ), Object.entries(t).map(([n, i]) => (de(i) || g(
    !1,
    `${e}.${n} must refer to an object with a "value" key representing an internal value but got: ${_(i)}.`
  ), {
    name: Si(n),
    description: i.description,
    value: i.value !== void 0 ? i.value : n,
    deprecationReason: i.deprecationReason,
    extensions: F(i.extensions),
    astNode: i.astNode
  }));
}
class Ri {
  constructor(t) {
    var n, i;
    this.name = Y(t.name), this.description = t.description, this.extensions = F(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this.isOneOf = (i = t.isOneOf) !== null && i !== void 0 ? i : !1, this._fields = Fi.bind(void 0, t);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLInputObjectType";
  }
  getFields() {
    return typeof this._fields == "function" && (this._fields = this._fields()), this._fields;
  }
  toConfig() {
    const t = Ve(this.getFields(), (n) => ({
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
function Fi(e) {
  const t = nn(e.fields);
  return de(t) || g(
    !1,
    `${e.name} fields must be an object with field names as keys or a function which returns such an object.`
  ), Ve(t, (n, i) => (!("resolve" in n) || g(
    !1,
    `${e.name}.${i} field has a resolve property, but Input Types cannot define resolvers.`
  ), {
    name: Y(i),
    description: n.description,
    type: n.type,
    defaultValue: n.defaultValue,
    deprecationReason: n.deprecationReason,
    extensions: F(n.extensions),
    astNode: n.astNode
  }));
}
const Xe = 2147483647, qe = -2147483648, Ci = new ve({
  name: "Int",
  description: "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",
  serialize(e) {
    const t = De(e);
    if (typeof t == "boolean")
      return t ? 1 : 0;
    let n = t;
    if (typeof t == "string" && t !== "" && (n = Number(t)), typeof n != "number" || !Number.isInteger(n))
      throw new I(
        `Int cannot represent non-integer value: ${_(t)}`
      );
    if (n > Xe || n < qe)
      throw new I(
        "Int cannot represent non 32-bit signed integer value: " + _(t)
      );
    return n;
  },
  parseValue(e) {
    if (typeof e != "number" || !Number.isInteger(e))
      throw new I(
        `Int cannot represent non-integer value: ${_(e)}`
      );
    if (e > Xe || e < qe)
      throw new I(
        `Int cannot represent non 32-bit signed integer value: ${e}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== o.INT)
      throw new I(
        `Int cannot represent non-integer value: ${K(e)}`,
        {
          nodes: e
        }
      );
    const t = parseInt(e.value, 10);
    if (t > Xe || t < qe)
      throw new I(
        `Int cannot represent non 32-bit signed integer value: ${e.value}`,
        {
          nodes: e
        }
      );
    return t;
  }
}), Ui = new ve({
  name: "Float",
  description: "The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).",
  serialize(e) {
    const t = De(e);
    if (typeof t == "boolean")
      return t ? 1 : 0;
    let n = t;
    if (typeof t == "string" && t !== "" && (n = Number(t)), typeof n != "number" || !Number.isFinite(n))
      throw new I(
        `Float cannot represent non numeric value: ${_(t)}`
      );
    return n;
  },
  parseValue(e) {
    if (typeof e != "number" || !Number.isFinite(e))
      throw new I(
        `Float cannot represent non numeric value: ${_(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== o.FLOAT && e.kind !== o.INT)
      throw new I(
        `Float cannot represent non numeric value: ${K(e)}`,
        e
      );
    return parseFloat(e.value);
  }
}), S = new ve({
  name: "String",
  description: "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
  serialize(e) {
    const t = De(e);
    if (typeof t == "string")
      return t;
    if (typeof t == "boolean")
      return t ? "true" : "false";
    if (typeof t == "number" && Number.isFinite(t))
      return t.toString();
    throw new I(
      `String cannot represent value: ${_(e)}`
    );
  },
  parseValue(e) {
    if (typeof e != "string")
      throw new I(
        `String cannot represent a non string value: ${_(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== o.STRING)
      throw new I(
        `String cannot represent a non string value: ${K(e)}`,
        {
          nodes: e
        }
      );
    return e.value;
  }
}), R = new ve({
  name: "Boolean",
  description: "The `Boolean` scalar type represents `true` or `false`.",
  serialize(e) {
    const t = De(e);
    if (typeof t == "boolean")
      return t;
    if (Number.isFinite(t))
      return t !== 0;
    throw new I(
      `Boolean cannot represent a non boolean value: ${_(t)}`
    );
  },
  parseValue(e) {
    if (typeof e != "boolean")
      throw new I(
        `Boolean cannot represent a non boolean value: ${_(e)}`
      );
    return e;
  },
  parseLiteral(e) {
    if (e.kind !== o.BOOLEAN)
      throw new I(
        `Boolean cannot represent a non boolean value: ${K(e)}`,
        {
          nodes: e
        }
      );
    return e.value;
  }
}), un = new ve({
  name: "ID",
  description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize(e) {
    const t = De(e);
    if (typeof t == "string")
      return t;
    if (Number.isInteger(t))
      return String(t);
    throw new I(
      `ID cannot represent value: ${_(e)}`
    );
  },
  parseValue(e) {
    if (typeof e == "string")
      return e;
    if (typeof e == "number" && Number.isInteger(e))
      return e.toString();
    throw new I(`ID cannot represent value: ${_(e)}`);
  },
  parseLiteral(e) {
    if (e.kind !== o.STRING && e.kind !== o.INT)
      throw new I(
        "ID cannot represent a non-string and non-integer value: " + K(e),
        {
          nodes: e
        }
      );
    return e.value;
  }
}), Mi = Object.freeze([
  S,
  Ci,
  Ui,
  R,
  un
]);
function Pi(e) {
  return Mi.some(({ name: t }) => e.name === t);
}
function De(e) {
  if (se(e)) {
    if (typeof e.valueOf == "function") {
      const t = e.valueOf();
      if (!se(t))
        return t;
    }
    if (typeof e.toJSON == "function")
      return e.toJSON();
  }
  return e;
}
function ji(e) {
  return G(e, Ee);
}
class Ee {
  constructor(t) {
    var n, i;
    this.name = Y(t.name), this.description = t.description, this.locations = t.locations, this.isRepeatable = (n = t.isRepeatable) !== null && n !== void 0 ? n : !1, this.extensions = F(t.extensions), this.astNode = t.astNode, Array.isArray(t.locations) || g(!1, `@${t.name} locations must be an Array.`);
    const s = (i = t.args) !== null && i !== void 0 ? i : {};
    se(s) && !Array.isArray(s) || g(
      !1,
      `@${t.name} args must be an object with argument names as keys.`
    ), this.args = on(s);
  }
  get [Symbol.toStringTag]() {
    return "GraphQLDirective";
  }
  toConfig() {
    return {
      name: this.name,
      description: this.description,
      locations: this.locations,
      args: cn(this.args),
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
const Bi = new Ee({
  name: "include",
  description: "Directs the executor to include this field or fragment only when the `if` argument is true.",
  locations: [
    E.FIELD,
    E.FRAGMENT_SPREAD,
    E.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new y(R),
      description: "Included when true."
    }
  }
}), Vi = new Ee({
  name: "skip",
  description: "Directs the executor to skip this field or fragment when the `if` argument is true.",
  locations: [
    E.FIELD,
    E.FRAGMENT_SPREAD,
    E.INLINE_FRAGMENT
  ],
  args: {
    if: {
      type: new y(R),
      description: "Skipped when true."
    }
  }
}), $i = "No longer supported", ln = new Ee({
  name: "deprecated",
  description: "Marks an element of a GraphQL schema as no longer supported.",
  locations: [
    E.FIELD_DEFINITION,
    E.ARGUMENT_DEFINITION,
    E.INPUT_FIELD_DEFINITION,
    E.ENUM_VALUE
  ],
  args: {
    reason: {
      type: S,
      description: "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
      defaultValue: $i
    }
  }
}), Gi = new Ee({
  name: "specifiedBy",
  description: "Exposes a URL that specifies the behavior of this scalar.",
  locations: [E.SCALAR],
  args: {
    url: {
      type: new y(S),
      description: "The URL that specifies the behavior of this scalar."
    }
  }
}), Yi = new Ee({
  name: "oneOf",
  description: "Indicates exactly one field must be supplied and this field must not be `null`.",
  locations: [E.INPUT_OBJECT],
  args: {}
}), pn = Object.freeze([
  Bi,
  Vi,
  ln,
  Gi,
  Yi
]);
function Qi(e) {
  return pn.some(({ name: t }) => t === e.name);
}
function Ji(e) {
  return typeof e == "object" && typeof e?.[Symbol.iterator] == "function";
}
function ge(e, t) {
  if (ce(t)) {
    const n = ge(e, t.ofType);
    return n?.kind === o.NULL ? null : n;
  }
  if (e === null)
    return {
      kind: o.NULL
    };
  if (e === void 0)
    return null;
  if (Te(t)) {
    const n = t.ofType;
    if (Ji(e)) {
      const i = [];
      for (const s of e) {
        const r = ge(s, n);
        r != null && i.push(r);
      }
      return {
        kind: o.LIST,
        values: i
      };
    }
    return ge(e, n);
  }
  if (Z(t)) {
    if (!se(e))
      return null;
    const n = [];
    for (const i of Object.values(t.getFields())) {
      const s = ge(e[i.name], i.type);
      s && n.push({
        kind: o.OBJECT_FIELD,
        name: {
          kind: o.NAME,
          value: i.name
        },
        value: s
      });
    }
    return {
      kind: o.OBJECT,
      fields: n
    };
  }
  if (en(t)) {
    const n = t.serialize(e);
    if (n == null)
      return null;
    if (typeof n == "boolean")
      return {
        kind: o.BOOLEAN,
        value: n
      };
    if (typeof n == "number" && Number.isFinite(n)) {
      const i = String(n);
      return xt.test(i) ? {
        kind: o.INT,
        value: i
      } : {
        kind: o.FLOAT,
        value: i
      };
    }
    if (typeof n == "string")
      return ae(t) ? {
        kind: o.ENUM,
        value: n
      } : t === un && xt.test(n) ? {
        kind: o.INT,
        value: n
      } : {
        kind: o.STRING,
        value: n
      };
    throw new TypeError(`Cannot convert value to AST: ${_(n)}.`);
  }
  at(!1, "Unexpected input type: " + _(t));
}
const xt = /^-?(?:0|[1-9][0-9]*)$/, dt = new ue({
  name: "__Schema",
  description: "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
  fields: () => ({
    description: {
      type: S,
      resolve: (e) => e.description
    },
    types: {
      description: "A list of all types supported by this server.",
      type: new y(new B(new y(V))),
      resolve(e) {
        return Object.values(e.getTypeMap());
      }
    },
    queryType: {
      description: "The type that query operations will be rooted at.",
      type: new y(V),
      resolve: (e) => e.getQueryType()
    },
    mutationType: {
      description: "If this server supports mutation, the type that mutation operations will be rooted at.",
      type: V,
      resolve: (e) => e.getMutationType()
    },
    subscriptionType: {
      description: "If this server support subscription, the type that subscription operations will be rooted at.",
      type: V,
      resolve: (e) => e.getSubscriptionType()
    },
    directives: {
      description: "A list of all directives supported by this server.",
      type: new y(
        new B(new y(dn))
      ),
      resolve: (e) => e.getDirectives()
    }
  })
}), dn = new ue({
  name: "__Directive",
  description: `A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.

In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.`,
  fields: () => ({
    name: {
      type: new y(S),
      resolve: (e) => e.name
    },
    description: {
      type: S,
      resolve: (e) => e.description
    },
    isRepeatable: {
      type: new y(R),
      resolve: (e) => e.isRepeatable
    },
    locations: {
      type: new y(
        new B(new y(fn))
      ),
      resolve: (e) => e.locations
    },
    args: {
      type: new y(
        new B(new y(Ge))
      ),
      args: {
        includeDeprecated: {
          type: R,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        return t ? e.args : e.args.filter((n) => n.deprecationReason == null);
      }
    }
  })
}), fn = new pt({
  name: "__DirectiveLocation",
  description: "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
  values: {
    QUERY: {
      value: E.QUERY,
      description: "Location adjacent to a query operation."
    },
    MUTATION: {
      value: E.MUTATION,
      description: "Location adjacent to a mutation operation."
    },
    SUBSCRIPTION: {
      value: E.SUBSCRIPTION,
      description: "Location adjacent to a subscription operation."
    },
    FIELD: {
      value: E.FIELD,
      description: "Location adjacent to a field."
    },
    FRAGMENT_DEFINITION: {
      value: E.FRAGMENT_DEFINITION,
      description: "Location adjacent to a fragment definition."
    },
    FRAGMENT_SPREAD: {
      value: E.FRAGMENT_SPREAD,
      description: "Location adjacent to a fragment spread."
    },
    INLINE_FRAGMENT: {
      value: E.INLINE_FRAGMENT,
      description: "Location adjacent to an inline fragment."
    },
    VARIABLE_DEFINITION: {
      value: E.VARIABLE_DEFINITION,
      description: "Location adjacent to a variable definition."
    },
    SCHEMA: {
      value: E.SCHEMA,
      description: "Location adjacent to a schema definition."
    },
    SCALAR: {
      value: E.SCALAR,
      description: "Location adjacent to a scalar definition."
    },
    OBJECT: {
      value: E.OBJECT,
      description: "Location adjacent to an object type definition."
    },
    FIELD_DEFINITION: {
      value: E.FIELD_DEFINITION,
      description: "Location adjacent to a field definition."
    },
    ARGUMENT_DEFINITION: {
      value: E.ARGUMENT_DEFINITION,
      description: "Location adjacent to an argument definition."
    },
    INTERFACE: {
      value: E.INTERFACE,
      description: "Location adjacent to an interface definition."
    },
    UNION: {
      value: E.UNION,
      description: "Location adjacent to a union definition."
    },
    ENUM: {
      value: E.ENUM,
      description: "Location adjacent to an enum definition."
    },
    ENUM_VALUE: {
      value: E.ENUM_VALUE,
      description: "Location adjacent to an enum value definition."
    },
    INPUT_OBJECT: {
      value: E.INPUT_OBJECT,
      description: "Location adjacent to an input object type definition."
    },
    INPUT_FIELD_DEFINITION: {
      value: E.INPUT_FIELD_DEFINITION,
      description: "Location adjacent to an input object field definition."
    }
  }
}), V = new ue({
  name: "__Type",
  description: "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
  fields: () => ({
    kind: {
      type: new y(Tn),
      resolve(e) {
        if ($e(e))
          return D.SCALAR;
        if (ie(e))
          return D.OBJECT;
        if (Q(e))
          return D.INTERFACE;
        if (oe(e))
          return D.UNION;
        if (ae(e))
          return D.ENUM;
        if (Z(e))
          return D.INPUT_OBJECT;
        if (Te(e))
          return D.LIST;
        if (ce(e))
          return D.NON_NULL;
        at(!1, `Unexpected type: "${_(e)}".`);
      }
    },
    name: {
      type: S,
      resolve: (e) => "name" in e ? e.name : void 0
    },
    description: {
      type: S,
      resolve: (e) => (
        /* c8 ignore next */
        "description" in e ? e.description : void 0
      )
    },
    specifiedByURL: {
      type: S,
      resolve: (e) => "specifiedByURL" in e ? e.specifiedByURL : void 0
    },
    fields: {
      type: new B(new y(hn)),
      args: {
        includeDeprecated: {
          type: R,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (ie(e) || Q(e)) {
          const n = Object.values(e.getFields());
          return t ? n : n.filter((i) => i.deprecationReason == null);
        }
      }
    },
    interfaces: {
      type: new B(new y(V)),
      resolve(e) {
        if (ie(e) || Q(e))
          return e.getInterfaces();
      }
    },
    possibleTypes: {
      type: new B(new y(V)),
      resolve(e, t, n, { schema: i }) {
        if (bi(e))
          return i.getPossibleTypes(e);
      }
    },
    enumValues: {
      type: new B(new y(mn)),
      args: {
        includeDeprecated: {
          type: R,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (ae(e)) {
          const n = e.getValues();
          return t ? n : n.filter((i) => i.deprecationReason == null);
        }
      }
    },
    inputFields: {
      type: new B(new y(Ge)),
      args: {
        includeDeprecated: {
          type: R,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        if (Z(e)) {
          const n = Object.values(e.getFields());
          return t ? n : n.filter((i) => i.deprecationReason == null);
        }
      }
    },
    ofType: {
      type: V,
      resolve: (e) => "ofType" in e ? e.ofType : void 0
    },
    isOneOf: {
      type: R,
      resolve: (e) => {
        if (Z(e))
          return e.isOneOf;
      }
    }
  })
}), hn = new ue({
  name: "__Field",
  description: "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
  fields: () => ({
    name: {
      type: new y(S),
      resolve: (e) => e.name
    },
    description: {
      type: S,
      resolve: (e) => e.description
    },
    args: {
      type: new y(
        new B(new y(Ge))
      ),
      args: {
        includeDeprecated: {
          type: R,
          defaultValue: !1
        }
      },
      resolve(e, { includeDeprecated: t }) {
        return t ? e.args : e.args.filter((n) => n.deprecationReason == null);
      }
    },
    type: {
      type: new y(V),
      resolve: (e) => e.type
    },
    isDeprecated: {
      type: new y(R),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: S,
      resolve: (e) => e.deprecationReason
    }
  })
}), Ge = new ue({
  name: "__InputValue",
  description: "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
  fields: () => ({
    name: {
      type: new y(S),
      resolve: (e) => e.name
    },
    description: {
      type: S,
      resolve: (e) => e.description
    },
    type: {
      type: new y(V),
      resolve: (e) => e.type
    },
    defaultValue: {
      type: S,
      description: "A GraphQL-formatted string representing the default value for this input value.",
      resolve(e) {
        const { type: t, defaultValue: n } = e, i = ge(n, t);
        return i ? K(i) : null;
      }
    },
    isDeprecated: {
      type: new y(R),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: S,
      resolve: (e) => e.deprecationReason
    }
  })
}), mn = new ue({
  name: "__EnumValue",
  description: "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
  fields: () => ({
    name: {
      type: new y(S),
      resolve: (e) => e.name
    },
    description: {
      type: S,
      resolve: (e) => e.description
    },
    isDeprecated: {
      type: new y(R),
      resolve: (e) => e.deprecationReason != null
    },
    deprecationReason: {
      type: S,
      resolve: (e) => e.deprecationReason
    }
  })
});
var D;
(function(e) {
  e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.INPUT_OBJECT = "INPUT_OBJECT", e.LIST = "LIST", e.NON_NULL = "NON_NULL";
})(D || (D = {}));
const Tn = new pt({
  name: "__TypeKind",
  description: "An enum describing what kind of type a given `__Type` is.",
  values: {
    SCALAR: {
      value: D.SCALAR,
      description: "Indicates this type is a scalar."
    },
    OBJECT: {
      value: D.OBJECT,
      description: "Indicates this type is an object. `fields` and `interfaces` are valid fields."
    },
    INTERFACE: {
      value: D.INTERFACE,
      description: "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields."
    },
    UNION: {
      value: D.UNION,
      description: "Indicates this type is a union. `possibleTypes` is a valid field."
    },
    ENUM: {
      value: D.ENUM,
      description: "Indicates this type is an enum. `enumValues` is a valid field."
    },
    INPUT_OBJECT: {
      value: D.INPUT_OBJECT,
      description: "Indicates this type is an input object. `inputFields` is a valid field."
    },
    LIST: {
      value: D.LIST,
      description: "Indicates this type is a list. `ofType` is a valid field."
    },
    NON_NULL: {
      value: D.NON_NULL,
      description: "Indicates this type is a non-null. `ofType` is a valid field."
    }
  }
});
new y(dt);
new y(S);
new y(S);
const Hi = Object.freeze([
  dt,
  dn,
  fn,
  V,
  hn,
  Ge,
  mn,
  Tn
]);
function zi(e) {
  return Hi.some(({ name: t }) => e.name === t);
}
function Xi(e) {
  return G(e, qi);
}
class qi {
  // Used as a cache for validateSchema().
  constructor(t) {
    var n, i;
    this.__validationErrors = t.assumeValid === !0 ? [] : void 0, se(t) || g(!1, "Must provide configuration object."), !t.types || Array.isArray(t.types) || g(
      !1,
      `"types" must be Array if provided but got: ${_(t.types)}.`
    ), !t.directives || Array.isArray(t.directives) || g(
      !1,
      `"directives" must be Array if provided but got: ${_(t.directives)}.`
    ), this.description = t.description, this.extensions = F(t.extensions), this.astNode = t.astNode, this.extensionASTNodes = (n = t.extensionASTNodes) !== null && n !== void 0 ? n : [], this._queryType = t.query, this._mutationType = t.mutation, this._subscriptionType = t.subscription, this._directives = (i = t.directives) !== null && i !== void 0 ? i : pn;
    const s = new Set(t.types);
    if (t.types != null)
      for (const r of t.types)
        s.delete(r), j(r, s);
    this._queryType != null && j(this._queryType, s), this._mutationType != null && j(this._mutationType, s), this._subscriptionType != null && j(this._subscriptionType, s);
    for (const r of this._directives)
      if (ji(r))
        for (const a of r.args)
          j(a.type, s);
    j(dt, s), this._typeMap = /* @__PURE__ */ Object.create(null), this._subTypeMap = /* @__PURE__ */ Object.create(null), this._implementationsMap = /* @__PURE__ */ Object.create(null);
    for (const r of s) {
      if (r == null)
        continue;
      const a = r.name;
      if (a || g(
        !1,
        "One of the provided types for building the Schema is missing a name."
      ), this._typeMap[a] !== void 0)
        throw new Error(
          `Schema must contain uniquely named types but contains multiple types named "${a}".`
        );
      if (this._typeMap[a] = r, Q(r)) {
        for (const c of r.getInterfaces())
          if (Q(c)) {
            let l = this._implementationsMap[c.name];
            l === void 0 && (l = this._implementationsMap[c.name] = {
              objects: [],
              interfaces: []
            }), l.interfaces.push(r);
          }
      } else if (ie(r)) {
        for (const c of r.getInterfaces())
          if (Q(c)) {
            let l = this._implementationsMap[c.name];
            l === void 0 && (l = this._implementationsMap[c.name] = {
              objects: [],
              interfaces: []
            }), l.objects.push(r);
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
      case J.QUERY:
        return this.getQueryType();
      case J.MUTATION:
        return this.getMutationType();
      case J.SUBSCRIPTION:
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
    return oe(t) ? t.getTypes() : this.getImplementations(t).objects;
  }
  getImplementations(t) {
    const n = this._implementationsMap[t.name];
    return n ?? {
      objects: [],
      interfaces: []
    };
  }
  isSubType(t, n) {
    let i = this._subTypeMap[t.name];
    if (i === void 0) {
      if (i = /* @__PURE__ */ Object.create(null), oe(t))
        for (const s of t.getTypes())
          i[s.name] = !0;
      else {
        const s = this.getImplementations(t);
        for (const r of s.objects)
          i[r.name] = !0;
        for (const r of s.interfaces)
          i[r.name] = !0;
      }
      this._subTypeMap[t.name] = i;
    }
    return i[n.name] !== void 0;
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
function j(e, t) {
  const n = xi(e);
  if (!t.has(n)) {
    if (t.add(n), oe(n))
      for (const i of n.getTypes())
        j(i, t);
    else if (ie(n) || Q(n)) {
      for (const i of n.getInterfaces())
        j(i, t);
      for (const i of Object.values(n.getFields())) {
        j(i.type, t);
        for (const s of i.args)
          j(s.type, t);
      }
    } else if (Z(n))
      for (const i of Object.values(n.getFields()))
        j(i.type, t);
  }
  return t;
}
function Wi(e) {
  return Zi(e) || Ki(e) || ts(e);
}
function Zi(e) {
  return e.kind === o.OPERATION_DEFINITION || e.kind === o.FRAGMENT_DEFINITION;
}
function Ki(e) {
  return e.kind === o.SCHEMA_DEFINITION || es(e) || e.kind === o.DIRECTIVE_DEFINITION;
}
function es(e) {
  return e.kind === o.SCALAR_TYPE_DEFINITION || e.kind === o.OBJECT_TYPE_DEFINITION || e.kind === o.INTERFACE_TYPE_DEFINITION || e.kind === o.UNION_TYPE_DEFINITION || e.kind === o.ENUM_TYPE_DEFINITION || e.kind === o.INPUT_OBJECT_TYPE_DEFINITION;
}
function ts(e) {
  return e.kind === o.SCHEMA_EXTENSION || ns(e);
}
function ns(e) {
  return e.kind === o.SCALAR_TYPE_EXTENSION || e.kind === o.OBJECT_TYPE_EXTENSION || e.kind === o.INTERFACE_TYPE_EXTENSION || e.kind === o.UNION_TYPE_EXTENSION || e.kind === o.ENUM_TYPE_EXTENSION || e.kind === o.INPUT_OBJECT_TYPE_EXTENSION;
}
const is = async (e, t) => {
  const n = e.config.graphql.plugins, i = {
    config: e.config,
    database: e.slonik,
    dbSchema: e.dbSchema
  };
  if (n)
    for (const s of n)
      await s.updateContext(i, e, t);
  return i;
}, ss = async (e) => {
  const t = e.config.graphql;
  t?.enabled ? await e.register(k, {
    context: is,
    ...t
  }) : e.log.info("GraphQL API not enabled");
};
Vt(ss);
var Ce = function() {
  return Ce = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var s in t)
        Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, Ce.apply(this, arguments);
}, Fe = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), vn = !0, Ue = !1;
function En(e) {
  return e.replace(/[\s,]+/g, " ").trim();
}
function rs(e) {
  return En(e.source.body.substring(e.start, e.end));
}
function os(e) {
  var t = /* @__PURE__ */ new Set(), n = [];
  return e.definitions.forEach(function(i) {
    if (i.kind === "FragmentDefinition") {
      var s = i.name.value, r = rs(i.loc), a = tt.get(s);
      a && !a.has(r) ? vn && console.warn("Warning: fragment with name " + s + ` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`) : a || tt.set(s, a = /* @__PURE__ */ new Set()), a.add(r), t.has(r) || (t.add(r), n.push(i));
    } else
      n.push(i);
  }), Ce(Ce({}, e), { definitions: n });
}
function as(e) {
  var t = new Set(e.definitions);
  t.forEach(function(i) {
    i.loc && delete i.loc, Object.keys(i).forEach(function(s) {
      var r = i[s];
      r && typeof r == "object" && t.add(r);
    });
  });
  var n = e.loc;
  return n && (delete n.startToken, delete n.endToken), e;
}
function cs(e) {
  var t = En(e);
  if (!Fe.has(t)) {
    var n = qt(e, {
      experimentalFragmentVariables: Ue,
      allowLegacyFragmentVariables: Ue
    });
    if (!n || n.kind !== "Document")
      throw new Error("Not a valid GraphQL document.");
    Fe.set(t, as(os(n)));
  }
  return Fe.get(t);
}
function ee(e) {
  for (var t = [], n = 1; n < arguments.length; n++)
    t[n - 1] = arguments[n];
  typeof e == "string" && (e = [e]);
  var i = e[0];
  return t.forEach(function(s, r) {
    s && s.kind === "Document" ? i += s.loc.source.body : i += s, i += e[r + 1];
  }), cs(i);
}
function us() {
  Fe.clear(), tt.clear();
}
function ls() {
  vn = !1;
}
function ps() {
  Ue = !0;
}
function ds() {
  Ue = !1;
}
var Ne = {
  gql: ee,
  resetCaches: us,
  disableFragmentWarnings: ls,
  enableExperimentalFragmentVariables: ps,
  disableExperimentalFragmentVariables: ds
};
(function(e) {
  e.gql = Ne.gql, e.resetCaches = Ne.resetCaches, e.disableFragmentWarnings = Ne.disableFragmentWarnings, e.enableExperimentalFragmentVariables = Ne.enableExperimentalFragmentVariables, e.disableExperimentalFragmentVariables = Ne.disableExperimentalFragmentVariables;
})(ee || (ee = {}));
ee.default = ee;
function fs(e, t) {
  return String(e) < String(t) ? -1 : String(e) > String(t) ? 1 : 0;
}
function kt(e) {
  let t;
  return "alias" in e && (t = e.alias?.value), t == null && "name" in e && (t = e.name?.value), t == null && (t = e.kind), t;
}
function Ye(e, t, n) {
  const i = kt(e), s = kt(t);
  return typeof n == "function" ? n(i, s) : fs(i, s);
}
function ft(e) {
  return e != null;
}
const yn = 3;
function Nn(e) {
  return Qe(e, []);
}
function Qe(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return hs(e, t);
    default:
      return String(e);
  }
}
function Lt(e) {
  return (e.name = "GraphQLError") ? e.toString() : `${e.name}: ${e.message};
 ${e.stack}`;
}
function hs(e, t) {
  if (e === null)
    return "null";
  if (e instanceof Error)
    return e.name === "AggregateError" ? Lt(e) + `
` + wt(e.errors, t) : Lt(e);
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (ms(e)) {
    const i = e.toJSON();
    if (i !== e)
      return typeof i == "string" ? i : Qe(i, n);
  } else if (Array.isArray(e))
    return wt(e, n);
  return Ts(e, n);
}
function ms(e) {
  return typeof e.toJSON == "function";
}
function Ts(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > yn ? "[" + vs(e) + "]" : "{ " + n.map(([i, s]) => i + ": " + Qe(s, t)).join(", ") + " }";
}
function wt(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > yn)
    return "[Array]";
  const n = e.length, i = [];
  for (let s = 0; s < n; ++s)
    i.push(Qe(e[s], t));
  return "[" + i.join(", ") + "]";
}
function vs(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
function Es(e) {
  return e != null && typeof e == "object" && Symbol.iterator in e;
}
function ys(e) {
  return typeof e == "object" && e !== null;
}
function ht(e, t = ["directives"]) {
  return t.reduce((n, i) => n == null ? n : n[i], e?.extensions);
}
function H(e) {
  if (ce(e)) {
    const t = H(e.ofType);
    if (t.kind === o.NON_NULL_TYPE)
      throw new Error(`Invalid type node ${Nn(e)}. Inner type of non-null type cannot be a non-null type.`);
    return {
      kind: o.NON_NULL_TYPE,
      type: t
    };
  } else if (Te(e))
    return {
      kind: o.LIST_TYPE,
      type: H(e.ofType)
    };
  return {
    kind: o.NAMED_TYPE,
    name: {
      kind: o.NAME,
      value: e.name
    }
  };
}
function Se(e) {
  if (e === null)
    return { kind: o.NULL };
  if (e === void 0)
    return null;
  if (Array.isArray(e)) {
    const t = [];
    for (const n of e) {
      const i = Se(n);
      i != null && t.push(i);
    }
    return { kind: o.LIST, values: t };
  }
  if (typeof e == "object") {
    if (e?.toJSON)
      return Se(e.toJSON());
    const t = [];
    for (const n in e) {
      const i = e[n], s = Se(i);
      s && t.push({
        kind: o.OBJECT_FIELD,
        name: { kind: o.NAME, value: n },
        value: s
      });
    }
    return { kind: o.OBJECT, fields: t };
  }
  if (typeof e == "boolean")
    return { kind: o.BOOLEAN, value: e };
  if (typeof e == "bigint")
    return { kind: o.INT, value: String(e) };
  if (typeof e == "number" && isFinite(e)) {
    const t = String(e);
    return Ns.test(t) ? { kind: o.INT, value: t } : { kind: o.FLOAT, value: t };
  }
  if (typeof e == "string")
    return { kind: o.STRING, value: e };
  throw new TypeError(`Cannot convert value to AST: ${e}.`);
}
const Ns = /^-?(?:0|[1-9][0-9]*)$/;
function te(e, t) {
  if (ce(t)) {
    const n = te(e, t.ofType);
    return n?.kind === o.NULL ? null : n;
  }
  if (e === null)
    return { kind: o.NULL };
  if (e === void 0)
    return null;
  if (Te(t)) {
    const n = t.ofType;
    if (Es(e)) {
      const i = [];
      for (const s of e) {
        const r = te(s, n);
        r != null && i.push(r);
      }
      return { kind: o.LIST, values: i };
    }
    return te(e, n);
  }
  if (Z(t)) {
    if (!ys(e))
      return null;
    const n = [];
    for (const i of Object.values(t.getFields())) {
      const s = te(e[i.name], i.type);
      s && n.push({
        kind: o.OBJECT_FIELD,
        name: { kind: o.NAME, value: i.name },
        value: s
      });
    }
    return { kind: o.OBJECT, fields: n };
  }
  if (en(t)) {
    const n = t.serialize(e);
    return n == null ? null : ae(t) ? { kind: o.ENUM, value: n } : t.name === "ID" && typeof n == "string" && Is.test(n) ? { kind: o.INT, value: n } : Se(n);
  }
  console.assert(!1, "Unexpected input type: " + Nn(t));
}
const Is = /^-?(?:0|[1-9][0-9]*)$/;
function C(e) {
  if (e.astNode?.description)
    return {
      ...e.astNode.description,
      block: !0
    };
  if (e.description)
    return {
      kind: o.STRING,
      value: e.description,
      block: !0
    };
}
function gs(e) {
  const t = /* @__PURE__ */ new WeakMap();
  return function(n) {
    const i = t.get(n);
    if (i === void 0) {
      const s = e(n);
      return t.set(n, s), s;
    }
    return i;
  };
}
const _s = gs(function(e) {
  const t = /* @__PURE__ */ new Map(), n = e.getQueryType();
  n && t.set("query", n);
  const i = e.getMutationType();
  i && t.set("mutation", i);
  const s = e.getSubscriptionType();
  return s && t.set("subscription", s), t;
});
function Os(e, t = {}) {
  const n = t.pathToDirectivesInExtensions, i = e.getTypeMap(), s = Ss(e, n), r = s != null ? [s] : [], a = e.getDirectives();
  for (const c of a)
    Qi(c) || r.push(bs(c, e, n));
  for (const c in i) {
    const l = i[c], p = Pi(l), d = zi(l);
    if (!(p || d))
      if (ie(l))
        r.push(As(l, e, n));
      else if (Q(l))
        r.push(Ds(l, e, n));
      else if (oe(l))
        r.push(xs(l, e, n));
      else if (Z(l))
        r.push(ks(l, e, n));
      else if (ae(l))
        r.push(Ls(l, e, n));
      else if ($e(l))
        r.push(ws(l, e, n));
      else
        throw new Error(`Unknown type ${l}.`);
  }
  return {
    kind: o.DOCUMENT,
    definitions: r
  };
}
function Ss(e, t) {
  const n = /* @__PURE__ */ new Map([
    ["query", void 0],
    ["mutation", void 0],
    ["subscription", void 0]
  ]), i = [];
  if (e.astNode != null && i.push(e.astNode), e.extensionASTNodes != null)
    for (const p of e.extensionASTNodes)
      i.push(p);
  for (const p of i)
    if (p.operationTypes)
      for (const d of p.operationTypes)
        n.set(d.operation, d);
  const s = _s(e);
  for (const [p, d] of n) {
    const m = s.get(p);
    if (m != null) {
      const N = H(m);
      d != null ? d.type = N : n.set(p, {
        kind: o.OPERATION_TYPE_DEFINITION,
        operation: p,
        type: N
      });
    }
  }
  const r = [...n.values()].filter(ft), a = ye(e, e, t);
  if (!r.length && !a.length)
    return null;
  const c = {
    kind: r != null ? o.SCHEMA_DEFINITION : o.SCHEMA_EXTENSION,
    operationTypes: r,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: a
  }, l = C(e);
  return l && (c.description = l), c;
}
function bs(e, t, n) {
  return {
    kind: o.DIRECTIVE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    arguments: e.args?.map((i) => In(i, t, n)),
    repeatable: e.isRepeatable,
    locations: e.locations?.map((i) => ({
      kind: o.NAME,
      value: i
    })) || []
  };
}
function ye(e, t, n) {
  const i = ht(e, n);
  let s = [];
  e.astNode != null && s.push(e.astNode), "extensionASTNodes" in e && e.extensionASTNodes != null && (s = s.concat(e.extensionASTNodes));
  let r;
  if (i != null)
    r = mt(t, i);
  else {
    r = [];
    for (const a of s)
      a.directives && r.push(...a.directives);
  }
  return r;
}
function Je(e, t, n) {
  let i = [], s = null;
  const r = ht(e, n);
  let a;
  return r != null ? a = mt(t, r) : a = e.astNode?.directives, a != null && (i = a.filter((c) => c.name.value !== "deprecated"), e.deprecationReason != null && (s = a.filter((c) => c.name.value === "deprecated")?.[0])), e.deprecationReason != null && s == null && (s = Cs(e.deprecationReason)), s == null ? i : [s].concat(i);
}
function In(e, t, n) {
  return {
    kind: o.INPUT_VALUE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    type: H(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    defaultValue: e.defaultValue !== void 0 ? te(e.defaultValue, e.type) ?? void 0 : void 0,
    directives: Je(e, t, n)
  };
}
function As(e, t, n) {
  return {
    kind: o.OBJECT_TYPE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((i) => gn(i, t, n)),
    interfaces: Object.values(e.getInterfaces()).map((i) => H(i)),
    directives: ye(e, t, n)
  };
}
function Ds(e, t, n) {
  const i = {
    kind: o.INTERFACE_TYPE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((s) => gn(s, t, n)),
    directives: ye(e, t, n)
  };
  return "getInterfaces" in e && (i.interfaces = Object.values(e.getInterfaces()).map((s) => H(s))), i;
}
function xs(e, t, n) {
  return {
    kind: o.UNION_TYPE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ye(e, t, n),
    types: e.getTypes().map((i) => H(i))
  };
}
function ks(e, t, n) {
  return {
    kind: o.INPUT_OBJECT_TYPE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    fields: Object.values(e.getFields()).map((i) => Rs(i, t, n)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ye(e, t, n)
  };
}
function Ls(e, t, n) {
  return {
    kind: o.ENUM_TYPE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    values: Object.values(e.getValues()).map((i) => Fs(i, t, n)),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: ye(e, t, n)
  };
}
function ws(e, t, n) {
  const i = ht(e, n), s = i ? mt(t, i) : e.astNode?.directives || [], r = e.specifiedByUrl || e.specifiedByURL;
  if (r && !s.some((a) => a.name.value === "specifiedBy")) {
    const a = {
      url: r
    };
    s.push(Me("specifiedBy", a));
  }
  return {
    kind: o.SCALAR_TYPE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: s
  };
}
function gn(e, t, n) {
  return {
    kind: o.FIELD_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    arguments: e.args.map((i) => In(i, t, n)),
    type: H(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: Je(e, t, n)
  };
}
function Rs(e, t, n) {
  return {
    kind: o.INPUT_VALUE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    type: H(e.type),
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: Je(e, t, n),
    defaultValue: te(e.defaultValue, e.type) ?? void 0
  };
}
function Fs(e, t, n) {
  return {
    kind: o.ENUM_VALUE_DEFINITION,
    description: C(e),
    name: {
      kind: o.NAME,
      value: e.name
    },
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: Je(e, t, n)
  };
}
function Cs(e) {
  return Me("deprecated", { reason: e }, ln);
}
function Me(e, t, n) {
  const i = [];
  if (n != null)
    for (const s of n.args) {
      const r = s.name, a = t[r];
      if (a !== void 0) {
        const c = te(a, s.type);
        c && i.push({
          kind: o.ARGUMENT,
          name: {
            kind: o.NAME,
            value: r
          },
          value: c
        });
      }
    }
  else
    for (const s in t) {
      const r = t[s], a = Se(r);
      a && i.push({
        kind: o.ARGUMENT,
        name: {
          kind: o.NAME,
          value: s
        },
        value: a
      });
    }
  return {
    kind: o.DIRECTIVE,
    name: {
      kind: o.NAME,
      value: e
    },
    arguments: i
  };
}
function mt(e, t) {
  const n = [];
  for (const i in t) {
    const s = t[i], r = e?.getDirective(i);
    if (Array.isArray(s))
      for (const a of s)
        n.push(Me(i, a, r));
    else
      n.push(Me(i, s, r));
  }
  return n;
}
const Us = 80;
let fe = {};
function nt() {
  fe = {};
}
function Ms(e) {
  const t = e.name?.value;
  if (t != null)
    switch (we(e, t), e.kind) {
      case "EnumTypeDefinition":
        if (e.values)
          for (const n of e.values)
            we(n, t, n.name.value);
        break;
      case "ObjectTypeDefinition":
      case "InputObjectTypeDefinition":
      case "InterfaceTypeDefinition":
        if (e.fields) {
          for (const n of e.fields)
            if (we(n, t, n.name.value), Gs(n) && n.arguments)
              for (const i of n.arguments)
                we(i, t, n.name.value, i.name.value);
        }
        break;
    }
}
function we(e, t, n, i) {
  const s = Ys(e);
  if (typeof s != "string" || s.length === 0)
    return;
  const r = [t];
  n && (r.push(n), i && r.push(i));
  const a = r.join(".");
  fe[a] || (fe[a] = []), fe[a].push(s);
}
function Ps(e) {
  return `
# ` + e.replace(/\n/g, `
# `);
}
function f(e, t) {
  return e ? e.filter((n) => n).join(t || "") : "";
}
function Rt(e) {
  return e?.some((t) => t.includes(`
`)) ?? !1;
}
function js(e) {
  return (t, n, i, s, r) => {
    const a = [], c = s.reduce((d, m) => (["fields", "arguments", "values"].includes(m) && d.name && a.push(d.name.value), d[m]), r[0]), l = [...a, c?.name?.value].filter(Boolean).join("."), p = [];
    return t.kind.includes("Definition") && fe[l] && p.push(...fe[l]), f([...p.map(Ps), t.description, e(t, n, i, s, r)], `
`);
  };
}
function be(e) {
  return e && `  ${e.replace(/\n/g, `
  `)}`;
}
function P(e) {
  return e && e.length !== 0 ? `{
${be(f(e, `
`))}
}` : "";
}
function O(e, t, n) {
  return t ? e + t + (n || "") : "";
}
function Bs(e, t = !1) {
  const n = e.replace(/"""/g, '\\"""');
  return (e[0] === " " || e[0] === "	") && e.indexOf(`
`) === -1 ? `"""${n.replace(/"$/, `"
`)}"""` : `"""
${t ? n : be(n)}
"""`;
}
const Ft = {
  Name: { leave: (e) => e.value },
  Variable: { leave: (e) => "$" + e.name },
  // Document
  Document: {
    leave: (e) => f(e.definitions, `

`)
  },
  OperationDefinition: {
    leave: (e) => {
      const t = O("(", f(e.variableDefinitions, ", "), ")");
      return f([e.operation, f([e.name, t]), f(e.directives, " ")], " ") + " " + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: i }) => e + ": " + t + O(" = ", n) + O(" ", f(i, " "))
  },
  SelectionSet: { leave: ({ selections: e }) => P(e) },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: i, selectionSet: s }) {
      const r = O("", e, ": ") + t;
      let a = r + O("(", f(n, ", "), ")");
      return a.length > Us && (a = r + O(`(
`, be(f(n, `
`)), `
)`)), f([a, f(i, " "), s], " ");
    }
  },
  Argument: { leave: ({ name: e, value: t }) => e + ": " + t },
  // Fragments
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + O(" ", f(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => f(["...", O("on ", e), f(t, " "), n], " ")
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: i, selectionSet: s }) => (
      // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      `fragment ${e}${O("(", f(n, ", "), ")")} on ${t} ${O("", f(i, " "), " ")}` + s
    )
  },
  // Value
  IntValue: { leave: ({ value: e }) => e },
  FloatValue: { leave: ({ value: e }) => e },
  StringValue: {
    leave: ({ value: e, block: t }) => t ? Bs(e) : JSON.stringify(e)
  },
  BooleanValue: { leave: ({ value: e }) => e ? "true" : "false" },
  NullValue: { leave: () => "null" },
  EnumValue: { leave: ({ value: e }) => e },
  ListValue: { leave: ({ values: e }) => "[" + f(e, ", ") + "]" },
  ObjectValue: { leave: ({ fields: e }) => "{" + f(e, ", ") + "}" },
  ObjectField: { leave: ({ name: e, value: t }) => e + ": " + t },
  // Directive
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + O("(", f(t, ", "), ")")
  },
  // Type
  NamedType: { leave: ({ name: e }) => e },
  ListType: { leave: ({ type: e }) => "[" + e + "]" },
  NonNullType: { leave: ({ type: e }) => e + "!" },
  // Type System Definitions
  SchemaDefinition: {
    leave: ({ directives: e, operationTypes: t }) => f(["schema", f(e, " "), P(t)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ name: e, directives: t }) => f(["scalar", e, f(t, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ name: e, interfaces: t, directives: n, fields: i }) => f([
      "type",
      e,
      O("implements ", f(t, " & ")),
      f(n, " "),
      P(i)
    ], " ")
  },
  FieldDefinition: {
    leave: ({ name: e, arguments: t, type: n, directives: i }) => e + (Rt(t) ? O(`(
`, be(f(t, `
`)), `
)`) : O("(", f(t, ", "), ")")) + ": " + n + O(" ", f(i, " "))
  },
  InputValueDefinition: {
    leave: ({ name: e, type: t, defaultValue: n, directives: i }) => f([e + ": " + t, O("= ", n), f(i, " ")], " ")
  },
  InterfaceTypeDefinition: {
    leave: ({ name: e, interfaces: t, directives: n, fields: i }) => f([
      "interface",
      e,
      O("implements ", f(t, " & ")),
      f(n, " "),
      P(i)
    ], " ")
  },
  UnionTypeDefinition: {
    leave: ({ name: e, directives: t, types: n }) => f(["union", e, f(t, " "), O("= ", f(n, " | "))], " ")
  },
  EnumTypeDefinition: {
    leave: ({ name: e, directives: t, values: n }) => f(["enum", e, f(t, " "), P(n)], " ")
  },
  EnumValueDefinition: {
    leave: ({ name: e, directives: t }) => f([e, f(t, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ name: e, directives: t, fields: n }) => f(["input", e, f(t, " "), P(n)], " ")
  },
  DirectiveDefinition: {
    leave: ({ name: e, arguments: t, repeatable: n, locations: i }) => "directive @" + e + (Rt(t) ? O(`(
`, be(f(t, `
`)), `
)`) : O("(", f(t, ", "), ")")) + (n ? " repeatable" : "") + " on " + f(i, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => f(["extend schema", f(e, " "), P(t)], " ")
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => f(["extend scalar", e, f(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: i }) => f([
      "extend type",
      e,
      O("implements ", f(t, " & ")),
      f(n, " "),
      P(i)
    ], " ")
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: i }) => f([
      "extend interface",
      e,
      O("implements ", f(t, " & ")),
      f(n, " "),
      P(i)
    ], " ")
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => f(["extend union", e, f(t, " "), O("= ", f(n, " | "))], " ")
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => f(["extend enum", e, f(t, " "), P(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => f(["extend input", e, f(t, " "), P(n)], " ")
  }
}, Vs = Object.keys(Ft).reduce((e, t) => ({
  ...e,
  [t]: {
    leave: js(Ft[t].leave)
  }
}), {});
function $s(e) {
  return Zt(e, Vs);
}
function Gs(e) {
  return e.kind === "FieldDefinition";
}
function Ys(e) {
  const t = Qs(e);
  if (t !== void 0)
    return Js(`
${t}`);
}
function Qs(e) {
  const t = e.loc;
  if (!t)
    return;
  const n = [];
  let i = t.startToken.prev;
  for (; i != null && i.kind === u.COMMENT && i.next != null && i.prev != null && i.line + 1 === i.next.line && i.line !== i.prev.line; ) {
    const s = String(i.value);
    n.push(s), i = i.prev;
  }
  return n.length > 0 ? n.reverse().join(`
`) : void 0;
}
function Js(e) {
  const t = e.split(/\r\n|[\n\r]/g), n = Hs(t);
  if (n !== 0)
    for (let i = 1; i < t.length; i++)
      t[i] = t[i].slice(n);
  for (; t.length > 0 && Ct(t[0]); )
    t.shift();
  for (; t.length > 0 && Ct(t[t.length - 1]); )
    t.pop();
  return t.join(`
`);
}
function Hs(e) {
  let t = null;
  for (let n = 1; n < e.length; n++) {
    const i = e[n], s = _n(i);
    if (s !== i.length && (t === null || s < t) && (t = s, t === 0))
      break;
  }
  return t === null ? 0 : t;
}
function _n(e) {
  let t = 0;
  for (; t < e.length && (e[t] === " " || e[t] === "	"); )
    t++;
  return t;
}
function Ct(e) {
  return _n(e) === e.length;
}
function zs(e) {
  return e && typeof e == "object" && "kind" in e && e.kind === o.DOCUMENT;
}
function Xs(e, t, n) {
  const i = qs([...t, ...e].filter(ft), n);
  return n && n.sort && i.sort(Ye), i;
}
function qs(e, t) {
  return e.reduce((n, i) => {
    const s = n.findIndex((r) => r.name.value === i.name.value);
    return s === -1 ? n.concat([i]) : (t?.reverseArguments || (n[s] = i), n);
  }, []);
}
function Ws(e, t) {
  return !!e.find((n) => n.name.value === t.name.value);
}
function On(e, t) {
  return !!t?.[e.name.value]?.repeatable;
}
function Ut(e, t) {
  return t.some(({ value: n }) => n === e.value);
}
function Sn(e, t) {
  const n = [...t];
  for (const i of e) {
    const s = n.findIndex((r) => r.name.value === i.name.value);
    if (s > -1) {
      const r = n[s];
      if (r.value.kind === "ListValue") {
        const a = r.value.values, c = i.value.values;
        r.value.values = bn(a, c, (l, p) => {
          const d = l.value;
          return !d || !p.some((m) => m.value === d);
        });
      } else
        r.value = i.value;
    } else
      n.push(i);
  }
  return n;
}
function Zs(e, t) {
  return e.map((n, i, s) => {
    const r = s.findIndex((a) => a.name.value === n.name.value);
    if (r !== i && !On(n, t)) {
      const a = s[r];
      return n.arguments = Sn(n.arguments, a.arguments), null;
    }
    return n;
  }).filter(ft);
}
function z(e = [], t = [], n, i) {
  const s = n && n.reverseDirectives, r = s ? e : t, a = s ? t : e, c = Zs([...r], i);
  for (const l of a)
    if (Ws(c, l) && !On(l, i)) {
      const p = c.findIndex((m) => m.name.value === l.name.value), d = c[p];
      c[p].arguments = Sn(l.arguments || [], d.arguments || []);
    } else
      c.push(l);
  return c;
}
function Ks(e, t) {
  return t ? {
    ...e,
    arguments: bn(t.arguments || [], e.arguments || [], (n, i) => !Ut(n.name, i.map((s) => s.name))),
    locations: [
      ...t.locations,
      ...e.locations.filter((n) => !Ut(n, t.locations))
    ]
  } : e;
}
function bn(e, t, n) {
  return e.concat(t.filter((i) => n(i, e)));
}
function er(e, t, n, i) {
  if (n?.consistentEnumMerge) {
    const a = [];
    e && a.push(...e), e = t, t = a;
  }
  const s = /* @__PURE__ */ new Map();
  if (e)
    for (const a of e)
      s.set(a.name.value, a);
  if (t)
    for (const a of t) {
      const c = a.name.value;
      if (s.has(c)) {
        const l = s.get(c);
        l.description = a.description || l.description, l.directives = z(a.directives, l.directives, i);
      } else
        s.set(c, a);
    }
  const r = [...s.values()];
  return n && n.sort && r.sort(Ye), r;
}
function tr(e, t, n, i) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    kind: n?.convertExtensions || e.kind === "EnumTypeDefinition" || t.kind === "EnumTypeDefinition" ? "EnumTypeDefinition" : "EnumTypeExtension",
    loc: e.loc,
    directives: z(e.directives, t.directives, n, i),
    values: er(e.values, t.values, n)
  } : n?.convertExtensions ? {
    ...e,
    kind: o.ENUM_TYPE_DEFINITION
  } : e;
}
function nr(e) {
  return typeof e == "string";
}
function ir(e) {
  return e instanceof ut;
}
function Mt(e) {
  let t = e;
  for (; t.kind === o.LIST_TYPE || t.kind === "NonNullType"; )
    t = t.type;
  return t;
}
function Pt(e) {
  return e.kind !== o.NAMED_TYPE;
}
function it(e) {
  return e.kind === o.LIST_TYPE;
}
function ne(e) {
  return e.kind === o.NON_NULL_TYPE;
}
function Pe(e) {
  return it(e) ? `[${Pe(e.type)}]` : ne(e) ? `${Pe(e.type)}!` : e.name.value;
}
var W;
(function(e) {
  e[e.A_SMALLER_THAN_B = -1] = "A_SMALLER_THAN_B", e[e.A_EQUALS_B = 0] = "A_EQUALS_B", e[e.A_GREATER_THAN_B = 1] = "A_GREATER_THAN_B";
})(W || (W = {}));
function sr(e, t) {
  return e == null && t == null ? W.A_EQUALS_B : e == null ? W.A_SMALLER_THAN_B : t == null ? W.A_GREATER_THAN_B : e < t ? W.A_SMALLER_THAN_B : e > t ? W.A_GREATER_THAN_B : W.A_EQUALS_B;
}
function rr(e, t) {
  const n = e.findIndex((i) => i.name.value === t.name.value);
  return [n > -1 ? e[n] : null, n];
}
function Tt(e, t, n, i, s) {
  const r = [];
  if (n != null && r.push(...n), t != null)
    for (const a of t) {
      const [c, l] = rr(r, a);
      if (c && !i?.ignoreFieldConflicts) {
        const p = i?.onFieldTypeConflict && i.onFieldTypeConflict(c, a, e, i?.throwOnConflict) || or(e, c, a, i?.throwOnConflict);
        p.arguments = Xs(a.arguments || [], c.arguments || [], i), p.directives = z(a.directives, c.directives, i, s), p.description = a.description || c.description, r[l] = p;
      } else
        r.push(a);
    }
  if (i && i.sort && r.sort(Ye), i && i.exclusions) {
    const a = i.exclusions;
    return r.filter((c) => !a.includes(`${e.name.value}.${c.name.value}`));
  }
  return r;
}
function or(e, t, n, i = !1) {
  const s = Pe(t.type), r = Pe(n.type);
  if (s !== r) {
    const a = Mt(t.type), c = Mt(n.type);
    if (a.name.value !== c.name.value)
      throw new Error(`Field "${n.name.value}" already defined with a different type. Declared as "${a.name.value}", but you tried to override with "${c.name.value}"`);
    if (!_e(t.type, n.type, !i))
      throw new Error(`Field '${e.name.value}.${t.name.value}' changed type from '${s}' to '${r}'`);
  }
  return ne(n.type) && !ne(t.type) && (t.type = n.type), t;
}
function _e(e, t, n = !1) {
  if (!Pt(e) && !Pt(t))
    return e.toString() === t.toString();
  if (ne(t)) {
    const i = ne(e) ? e.type : e;
    return _e(i, t.type);
  }
  return ne(e) ? _e(t, e, n) : it(e) ? it(t) && _e(e.type, t.type) || ne(t) && _e(e, t.type) : !1;
}
function ar(e, t, n, i) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n?.convertExtensions || e.kind === "InputObjectTypeDefinition" || t.kind === "InputObjectTypeDefinition" ? "InputObjectTypeDefinition" : "InputObjectTypeExtension",
        loc: e.loc,
        fields: Tt(e, e.fields, t.fields, n),
        directives: z(e.directives, t.directives, n, i)
      };
    } catch (s) {
      throw new Error(`Unable to merge GraphQL input type "${e.name.value}": ${s.message}`);
    }
  return n?.convertExtensions ? {
    ...e,
    kind: o.INPUT_OBJECT_TYPE_DEFINITION
  } : e;
}
function cr(e, t) {
  return !!e.find((n) => n.name.value === t.name.value);
}
function vt(e = [], t = [], n = {}) {
  const i = [...t, ...e.filter((s) => !cr(t, s))];
  return n && n.sort && i.sort(Ye), i;
}
function ur(e, t, n, i) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n?.convertExtensions || e.kind === "InterfaceTypeDefinition" || t.kind === "InterfaceTypeDefinition" ? "InterfaceTypeDefinition" : "InterfaceTypeExtension",
        loc: e.loc,
        fields: Tt(e, e.fields, t.fields, n),
        directives: z(e.directives, t.directives, n, i),
        interfaces: e.interfaces ? vt(e.interfaces, t.interfaces, n) : void 0
      };
    } catch (s) {
      throw new Error(`Unable to merge GraphQL interface "${e.name.value}": ${s.message}`);
    }
  return n?.convertExtensions ? {
    ...e,
    kind: o.INTERFACE_TYPE_DEFINITION
  } : e;
}
var $ = {};
Object.defineProperty($, "__esModule", {
  value: !0
});
$.Token = $.QueryDocumentKeys = $.OperationTypeNode = $.Location = void 0;
var lr = $.isNode = hr;
class pr {
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
  constructor(t, n, i) {
    this.start = t.start, this.end = n.end, this.startToken = t, this.endToken = n, this.source = i;
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
$.Location = pr;
class dr {
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
  constructor(t, n, i, s, r, a) {
    this.kind = t, this.start = n, this.end = i, this.line = s, this.column = r, this.value = a, this.prev = null, this.next = null;
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
$.Token = dr;
const An = {
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
$.QueryDocumentKeys = An;
const fr = new Set(Object.keys(An));
function hr(e) {
  const t = e?.kind;
  return typeof t == "string" && fr.has(t);
}
var st;
$.OperationTypeNode = st;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(st || ($.OperationTypeNode = st = {}));
function mr(e, t, n, i) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    kind: n?.convertExtensions || e.kind === "ScalarTypeDefinition" || t.kind === "ScalarTypeDefinition" ? "ScalarTypeDefinition" : "ScalarTypeExtension",
    loc: e.loc,
    directives: z(e.directives, t.directives, n, i)
  } : n?.convertExtensions ? {
    ...e,
    kind: o.SCALAR_TYPE_DEFINITION
  } : e;
}
const rt = {
  query: "Query",
  mutation: "Mutation",
  subscription: "Subscription"
};
function Tr(e = [], t = []) {
  const n = [];
  for (const i in rt) {
    const s = e.find((r) => r.operation === i) || t.find((r) => r.operation === i);
    s && n.push(s);
  }
  return n;
}
function vr(e, t, n, i) {
  return t ? {
    kind: e.kind === o.SCHEMA_DEFINITION || t.kind === o.SCHEMA_DEFINITION ? o.SCHEMA_DEFINITION : o.SCHEMA_EXTENSION,
    description: e.description || t.description,
    directives: z(e.directives, t.directives, n, i),
    operationTypes: Tr(e.operationTypes, t.operationTypes)
  } : n?.convertExtensions ? {
    ...e,
    kind: o.SCHEMA_DEFINITION
  } : e;
}
function Er(e, t, n, i) {
  if (t)
    try {
      return {
        name: e.name,
        description: e.description || t.description,
        kind: n?.convertExtensions || e.kind === "ObjectTypeDefinition" || t.kind === "ObjectTypeDefinition" ? "ObjectTypeDefinition" : "ObjectTypeExtension",
        loc: e.loc,
        fields: Tt(e, e.fields, t.fields, n),
        directives: z(e.directives, t.directives, n, i),
        interfaces: vt(e.interfaces, t.interfaces, n)
      };
    } catch (s) {
      throw new Error(`Unable to merge GraphQL type "${e.name.value}": ${s.message}`);
    }
  return n?.convertExtensions ? {
    ...e,
    kind: o.OBJECT_TYPE_DEFINITION
  } : e;
}
function yr(e, t, n, i) {
  return t ? {
    name: e.name,
    description: e.description || t.description,
    // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
    directives: z(e.directives, t.directives, n, i),
    kind: n?.convertExtensions || e.kind === "UnionTypeDefinition" || t.kind === "UnionTypeDefinition" ? o.UNION_TYPE_DEFINITION : o.UNION_TYPE_EXTENSION,
    loc: e.loc,
    types: vt(e.types, t.types, n)
  } : n?.convertExtensions ? {
    ...e,
    kind: o.UNION_TYPE_DEFINITION
  } : e;
}
const pe = "SCHEMA_DEF_SYMBOL";
function Nr(e) {
  return "name" in e;
}
function jt(e, t, n = {}) {
  const i = n;
  for (const s of e)
    if (Nr(s)) {
      const r = s.name?.value;
      if (t?.commentDescriptions && Ms(s), r == null)
        continue;
      if (t?.exclusions?.includes(r + ".*") || t?.exclusions?.includes(r))
        delete i[r];
      else
        switch (s.kind) {
          case o.OBJECT_TYPE_DEFINITION:
          case o.OBJECT_TYPE_EXTENSION:
            i[r] = Er(s, i[r], t, n);
            break;
          case o.ENUM_TYPE_DEFINITION:
          case o.ENUM_TYPE_EXTENSION:
            i[r] = tr(s, i[r], t, n);
            break;
          case o.UNION_TYPE_DEFINITION:
          case o.UNION_TYPE_EXTENSION:
            i[r] = yr(s, i[r], t, n);
            break;
          case o.SCALAR_TYPE_DEFINITION:
          case o.SCALAR_TYPE_EXTENSION:
            i[r] = mr(s, i[r], t, n);
            break;
          case o.INPUT_OBJECT_TYPE_DEFINITION:
          case o.INPUT_OBJECT_TYPE_EXTENSION:
            i[r] = ar(s, i[r], t, n);
            break;
          case o.INTERFACE_TYPE_DEFINITION:
          case o.INTERFACE_TYPE_EXTENSION:
            i[r] = ur(s, i[r], t, n);
            break;
          case o.DIRECTIVE_DEFINITION:
            i[r] && r in {} && (lr(i[r]) || (i[r] = void 0)), i[r] = Ks(s, i[r]);
            break;
        }
    } else
      (s.kind === o.SCHEMA_DEFINITION || s.kind === o.SCHEMA_EXTENSION) && (i[pe] = vr(s, i[pe], t));
  return i;
}
function Ir(e, t) {
  nt();
  const n = {
    kind: o.DOCUMENT,
    definitions: gr(e, {
      useSchemaDefinition: !0,
      forceSchemaDefinition: !1,
      throwOnConflict: !1,
      commentDescriptions: !1,
      ...t
    })
  };
  let i;
  return t?.commentDescriptions ? i = $s(n) : i = n, nt(), i;
}
function le(e, t, n = [], i = [], s = /* @__PURE__ */ new Set()) {
  if (e && !s.has(e))
    if (s.add(e), typeof e == "function")
      le(e(), t, n, i, s);
    else if (Array.isArray(e))
      for (const r of e)
        le(r, t, n, i, s);
    else if (Xi(e)) {
      const r = Os(e, t);
      le(r.definitions, t, n, i, s);
    } else if (nr(e) || ir(e)) {
      const r = qt(e, t);
      le(r.definitions, t, n, i, s);
    } else if (typeof e == "object" && Wi(e))
      e.kind === o.DIRECTIVE_DEFINITION ? n.push(e) : i.push(e);
    else if (zs(e))
      le(e.definitions, t, n, i, s);
    else
      throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof e}`);
  return { allDirectives: n, allNodes: i };
}
function gr(e, t) {
  nt();
  const { allDirectives: n, allNodes: i } = le(e, t), s = jt(n, t), r = jt(i, t, s);
  if (t?.useSchemaDefinition) {
    const c = r[pe] || {
      kind: o.SCHEMA_DEFINITION,
      operationTypes: []
    }, l = c.operationTypes;
    for (const p in rt)
      if (!l.find((d) => d.operation === p)) {
        const d = rt[p], m = r[d];
        m != null && m.name != null && l.push({
          kind: o.OPERATION_TYPE_DEFINITION,
          type: {
            kind: o.NAMED_TYPE,
            name: m.name
          },
          operation: p
        });
      }
    c?.operationTypes?.length != null && c.operationTypes.length > 0 && (r[pe] = c);
  }
  t?.forceSchemaDefinition && !r[pe]?.operationTypes?.length && (r[pe] = {
    kind: o.SCHEMA_DEFINITION,
    operationTypes: [
      {
        kind: o.OPERATION_TYPE_DEFINITION,
        operation: "query",
        type: {
          kind: o.NAMED_TYPE,
          name: {
            kind: o.NAME,
            value: "Query"
          }
        }
      }
    ]
  });
  const a = Object.values(r);
  if (t?.sort) {
    const c = typeof t.sort == "function" ? t.sort : sr;
    a.sort((l, p) => c(l.name?.value, p.name?.value));
  }
  return a;
}
const _r = ee`
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
`, Or = (e, t) => {
  if (!(kn.length > 0)) {
    if (e.firebase?.enabled !== !1 && !e.firebase.credentials) {
      t.log.error("Firebase credentials are missing");
      return;
    }
    try {
      Ln({
        credential: wn.cert({
          projectId: e.firebase.credentials?.projectId,
          privateKey: e.firebase.credentials?.privateKey.replace(
            /\\n/g,
            `
`
          ),
          clientEmail: e.firebase.credentials?.clientEmail
        })
      });
    } catch (n) {
      t.log.error("Failed to initialize firebase"), t.log.error(n);
    }
  }
}, Dn = async (e) => {
  await Rn().sendEachForMulticast(e);
}, Sr = "/send-notification", br = "/user-device", Ar = "/user-device", xn = "user_devices", Dr = (e) => {
  const t = e.firebase.table?.userDevices?.name || xn;
  return Oe.unsafe`
    CREATE TABLE IF NOT EXISTS ${Oe.identifier([t])} (
        id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        device_token VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_user_id_device_token ON ${Oe.identifier([
    t
  ])} (user_id, device_token);
  `;
}, xr = async (e, t) => {
  await e.connect(async (n) => {
    await n.query(Dr(t));
  });
}, kr = async (e, t, n) => {
  const { config: i, slonik: s, log: r } = e;
  i.firebase.enabled === !1 ? r.info("fastify-firebase plugin is not enabled") : (r.info("Registering fastify-firebase plugin"), await xr(s, i), Or(i, e)), n();
}, Hr = Vt(kr);
class Lr extends Fn {
  getFindByUserIdSql = (t) => Oe.type(this.validationSchema)`
      SELECT * 
      FROM ${this.getTableFragment()}
      WHERE user_id = ${t};
    `;
  getDeleteExistingTokenSql = (t) => Oe.type(this.validationSchema)`
      DELETE
      FROM ${this.getTableFragment()}
      WHERE device_token = ${t}
      RETURNING *;
    `;
}
class he extends Cn {
  get table() {
    return xn;
  }
  get factory() {
    if (!this.table)
      throw new Error("Service table is not defined");
    return this._factory || (this._factory = new Lr(this)), this._factory;
  }
  create = async (t) => {
    const { deviceToken: n } = t;
    await this.removeByDeviceToken(n);
    const i = this.factory.getCreateSql(t);
    return await this.database.connect((r) => r.maybeOne(i));
  };
  getByUserId = async (t) => {
    const n = this.factory.getFindByUserIdSql(t);
    return await this.database.connect((s) => s.any(n));
  };
  removeByDeviceToken = async (t) => {
    const n = this.factory.getDeleteExistingTokenSql(t);
    return await this.database.connect((s) => s.maybeOne(n));
  };
}
const wr = async (e, t) => {
  if (!e.session?.getUserId())
    throw e.log.error("user id is not defined"), new Error("Oops, Please login to continue");
  const {
    body: i,
    title: s,
    data: r,
    userId: a
  } = e.body;
  if (!a)
    throw e.log.error("receiver id is not defined"), new Error("Oops, Please provide a receiver id");
  const l = await new he(
    e.config,
    e.slonik,
    e.dbSchema
  ).getByUserId(a);
  if (!l || l.length === 0)
    throw e.log.error("no device found for the receiver"), new Error("Unable to find device for the receiver");
  const p = l.map((m) => m.deviceToken), d = {
    android: {
      priority: "high",
      notification: {
        sound: "default"
      }
    },
    apns: {
      payload: {
        aps: {
          sound: "default"
        }
      }
    },
    tokens: p,
    notification: {
      title: s,
      body: i
    },
    data: {
      ...r,
      title: s,
      body: i
    }
  };
  await Dn(d), t.send({ message: "Notification sent successfully" });
}, Rr = {
  sendNotification: wr
}, ot = (e) => async () => {
  if (e.config.firebase.enabled === !1)
    throw new Error("Firebase is not enabled");
}, zr = async (e, t, n) => {
  const i = e.config.firebase.handlers?.userDevice, s = e.config.firebase.notification;
  s?.test?.enabled && e.post(
    s.test.path || Sr,
    {
      preHandler: [e.verifySession(), ot(e)]
    },
    i?.addUserDevice || Rr.sendNotification
  ), n();
}, Fr = {
  sendNotification: async (e, t, n) => {
    const { app: i, config: s, dbSchema: r, database: a, user: c } = n;
    if (c?.id || new k.ErrorWithProps("Could not get user id", {}, 403), s.firebase.enabled === !1)
      return new k.ErrorWithProps("Firebase is not enabled", {}, 404);
    try {
      const { userId: p, title: d, body: m, data: N } = t.data;
      if (!p)
        return new k.ErrorWithProps("Receiver id is required", {}, 400);
      const v = await new he(
        s,
        a,
        r
      ).getByUserId(p);
      if (!v || v.length === 0)
        return new k.ErrorWithProps(
          "Receiver device not found",
          {},
          404
        );
      const U = {
        tokens: v.map(
          (w) => w.deviceToken
        ),
        notification: {
          title: d,
          body: m
        },
        data: N
      };
      return await Dn(U), { message: "Notification sent successfully" };
    } catch (p) {
      i.log.error(p);
      const d = new k.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  }
}, Cr = {}, Xr = { Mutation: Fr, Query: Cr }, Ur = {
  addUserDevice: async (e, t, n) => {
    const { app: i, config: s, dbSchema: r, database: a, user: c } = n, l = c?.id;
    if (s.firebase.enabled === !1)
      return new k.ErrorWithProps("Firebase is not enabled", {}, 404);
    if (!l)
      return new k.ErrorWithProps("Could not get user id", {}, 403);
    try {
      const { deviceToken: p } = t.data;
      return await new he(s, a, r).create({ userId: l, deviceToken: p });
    } catch (p) {
      i.log.error(p);
      const d = new k.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  },
  removeUserDevice: async (e, t, n) => {
    const { app: i, config: s, dbSchema: r, database: a, user: c } = n, l = c?.id;
    if (s.firebase.enabled === !1)
      return new k.ErrorWithProps("Firebase is not enabled", {}, 404);
    if (!l)
      return new k.ErrorWithProps("Could not get user id", {}, 403);
    try {
      const { deviceToken: p } = t.data, d = new he(s, a, r), m = await d.getByUserId(l);
      return !m || m.length === 0 ? new k.ErrorWithProps(
        "No devices found for user",
        {},
        403
      ) : m.find(
        (A) => A.deviceToken === p
      ) ? await d.removeByDeviceToken(p) : new k.ErrorWithProps(
        "Device requested to delete not owned by user",
        {},
        403
      );
    } catch (p) {
      i.log.error(p);
      const d = new k.ErrorWithProps(
        "Oops, Something went wrong"
      );
      return d.statusCode = 500, d;
    }
  }
}, Mr = {}, qr = { Mutation: Ur, Query: Mr }, Pr = async (e, t) => {
  const n = e.session?.getUserId();
  if (!n)
    throw e.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const { deviceToken: i } = e.body;
  if (!i)
    throw e.log.error("device token is not defined"), new Error("Oops, Something went wrong");
  const s = new he(e.config, e.slonik, e.dbSchema);
  t.send(await s.create({ userId: n, deviceToken: i }));
}, jr = async (e, t) => {
  const n = e.session?.getUserId();
  if (!n)
    throw e.log.error("could not get user id from session"), new Error("Oops, Something went wrong");
  const { deviceToken: i } = e.body;
  if (!i)
    throw e.log.error("device token is not defined"), new Error("Oops, Something went wrong");
  const s = new he(e.config, e.slonik, e.dbSchema), r = await s.getByUserId(n);
  if (!r || r.length === 0)
    throw e.log.error("No devices found for user"), new Error("Oops, Something went wrong");
  if (!r.find(
    (c) => c.deviceToken === i
  ))
    throw e.log.error("device requested to delete not owned by user"), new Error("Oops, Something went wrong");
  t.send(await s.removeByDeviceToken(i));
}, Bt = {
  addUserDevice: Pr,
  removeUserDevice: jr
}, Wr = async (e, t, n) => {
  const i = e.config.firebase.handlers?.userDevice;
  e.post(
    br,
    {
      preHandler: [e.verifySession(), ot(e)]
    },
    i?.addUserDevice || Bt.addUserDevice
  ), e.delete(
    Ar,
    {
      preHandler: [e.verifySession(), ot(e)]
    },
    i?.removeUserDevice || Bt.removeUserDevice
  ), n();
}, Br = ee`
  type SendNotificationResponse {
    message: String!
  }

  input SendNotificationInput {
    userId: String!
    title: String!
    body: String!
  }

  type Mutation {
    sendNotification(data: SendNotificationInput): SendNotificationResponse
      @auth
  }
`, Vr = ee`
  type UserDevice {
    id: Int!
    userId: String!
    deviceToken: String!
    createdAt: Float!
    updatedAt: Float!
  }

  type UserDevices {
    data: [UserDevice]!
  }

  input UserDeviceCreateInput {
    deviceToken: String!
  }

  input UserDeviceUpdateInput {
    deviceToken: String!
  }

  input UserDeviceRemoveInput {
    deviceToken: String!
  }

  type Mutation {
    addUserDevice(data: UserDeviceCreateInput): UserDevice @auth
    removeUserDevice(data: UserDeviceRemoveInput): UserDevice @auth
  }
`, Zr = Ir([
  _r,
  Br,
  Vr
]);
export {
  he as UserDeviceService,
  Hr as default,
  Zr as firebaseSchema,
  Or as initializeFirebase,
  Xr as notificationResolver,
  zr as notificationRoutes,
  Dn as sendPushNotification,
  qr as userDeviceResolver,
  Wr as userDeviceRoutes
};
