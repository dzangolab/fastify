(function(c,f){typeof exports=="object"&&typeof module<"u"?f(exports,require("@dzangolab/fastify-slonik"),require("fastify-plugin"),require("mercurius"),require("graphql"),require("slonik")):typeof define=="function"&&define.amd?define(["exports","@dzangolab/fastify-slonik","fastify-plugin","mercurius","graphql","slonik"],f):(c=typeof globalThis<"u"?globalThis:c||self,f(c["12degBillingFastify"]={},c.DzangolabFastifySlonik,c.FastifyPlugin,c.Mercurius,c.Graphql,c.Slonik))})(this,function(c,f,D,j,_,I){"use strict";const A="organizations";class d extends f.BaseService{static TABLE=A}const v={createOrganization:async(e,n)=>{const i=new d(e.config,e.slonik),t=e.body,r=await i.create(t);n.send(r)},deleteOrganization:async(e,n)=>{const i=new d(e.config,e.slonik),{id:t}=e.params,r=await i.delete(t);n.send(r)},listOrganization:async(e,n)=>{const i=new d(e.config,e.slonik),{limit:t,offset:r,filters:s,sort:l}=e.query,E=await i.list(t,r,s?JSON.parse(s):void 0,l?JSON.parse(l):void 0);n.send(E)},organization:async(e,n)=>{const i=new d(e.config,e.slonik),{id:t}=e.params,r=await i.findById(t);n.send(r)},updateOrganization:async(e,n)=>{const i=new d(e.config,e.slonik),{id:t}=e.params,r=e.body,s=await i.update(t,r);n.send(s)}},H=async(e,n,i)=>{const t=e.config.organization?.handlers?.organization;e.get("/organizations",{preHandler:e.verifySession()},t?.list||v.listOrganization),e.get("/organizations/:id(^\\d+)",{preHandler:e.verifySession()},t?.organization||v.organization),e.delete("/organizations/:id(^\\d+)",{preHandler:e.verifySession()},t?.delete||v.deleteOrganization),e.post("/organizations",{preHandler:e.verifySession()},t?.create||v.createOrganization),e.put("/organizations/:id(^\\d+)",{preHandler:e.verifySession()},t?.update||v.updateOrganization),i()},M={Mutation:{createOrganization:async(e,n,i)=>{const t=new d(i.config,i.database);try{if(!i.user)throw new Error("UserId not found in session.");return await t.create(n.data)}catch(r){console.log(r)}},deleteOrganization:async(e,n,i)=>{const t=new d(i.config,i.database);try{return await t.delete(n.id)}catch(r){console.log(r)}},updateOrganization:async(e,n,i)=>{const t=new d(i.config,i.database);try{return await t.update(n.id,n.data)}catch(r){console.log(r)}}},Query:{organization:async(e,n,i)=>await new d(i.config,i.database).findById(n.id),organizations:async(e,n,i)=>await new d(i.config,i.database).list(n.limit,n.offset,n.filters?JSON.parse(JSON.stringify(n.filters)):void 0,n.sort?JSON.parse(JSON.stringify(n.sort)):void 0)}},U=async(e,n)=>{const i=e.config.graphql.plugins,t={config:e.config,database:e.slonik,dbSchema:e.dbSchema};if(i)for(const r of i)await r.updateContext(t,e,n);return t};D(async e=>{const n=e.config.graphql;n?.enabled?await e.register(j,{context:U,...n}):e.log.info("GraphQL API not enabled")});var S=function(){return S=Object.assign||function(e){for(var n,i=1,t=arguments.length;i<t;i++){n=arguments[i];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},S.apply(this,arguments)},O=new Map,T=new Map,N=!0,h=!1;function V(e){return e.replace(/[\s,]+/g," ").trim()}function J(e){return V(e.source.body.substring(e.start,e.end))}function $(e){var n=new Set,i=[];return e.definitions.forEach(function(t){if(t.kind==="FragmentDefinition"){var r=t.name.value,s=J(t.loc),l=T.get(r);l&&!l.has(s)?N&&console.warn("Warning: fragment with name "+r+` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`):l||T.set(r,l=new Set),l.add(s),n.has(s)||(n.add(s),i.push(t))}else i.push(t)}),S(S({},e),{definitions:i})}function Q(e){var n=new Set(e.definitions);n.forEach(function(t){t.loc&&delete t.loc,Object.keys(t).forEach(function(r){var s=t[r];s&&typeof s=="object"&&n.add(s)})});var i=e.loc;return i&&(delete i.startToken,delete i.endToken),e}function q(e){var n=V(e);if(!O.has(n)){var i=_.parse(e,{experimentalFragmentVariables:h,allowLegacyFragmentVariables:h});if(!i||i.kind!=="Document")throw new Error("Not a valid GraphQL document.");O.set(n,Q($(i)))}return O.get(n)}function g(e){for(var n=[],i=1;i<arguments.length;i++)n[i-1]=arguments[i];typeof e=="string"&&(e=[e]);var t=e[0];return n.forEach(function(r,s){r&&r.kind==="Document"?t+=r.loc.source.body:t+=r,t+=e[s+1]}),q(t)}function G(){O.clear(),T.clear()}function P(){N=!1}function Y(){h=!0}function W(){h=!1}var m={gql:g,resetCaches:G,disableFragmentWarnings:P,enableExperimentalFragmentVariables:Y,disableExperimentalFragmentVariables:W};(function(e){e.gql=m.gql,e.resetCaches=m.resetCaches,e.disableFragmentWarnings=m.disableFragmentWarnings,e.enableExperimentalFragmentVariables=m.enableExperimentalFragmentVariables,e.disableExperimentalFragmentVariables=m.disableExperimentalFragmentVariables})(g||(g={})),g.default=g;const K=80;let F={};function X(e){return`
# `+e.replace(/\n/g,`
# `)}function a(e,n){return e?e.filter(i=>i).join(n||""):""}function w(e){return e?.some(n=>n.includes(`
`))??!1}function Z(e){return(n,i,t,r,s)=>{const l=[],E=r.reduce((z,L)=>(["fields","arguments","values"].includes(L)&&z.name&&l.push(z.name.value),z[L]),s[0]),R=[...l,E?.name?.value].filter(Boolean).join("."),C=[];return n.kind.includes("Definition")&&F[R]&&C.push(...F[R]),a([...C.map(X),n.description,e(n,i,t,r,s)],`
`)}}function y(e){return e&&`  ${e.replace(/\n/g,`
  `)}`}function u(e){return e&&e.length!==0?`{
${y(a(e,`
`))}
}`:""}function o(e,n,i){return n?e+n+(i||""):""}function ee(e,n=!1){const i=e.replace(/"""/g,'\\"""');return(e[0]===" "||e[0]==="	")&&e.indexOf(`
`)===-1?`"""${i.replace(/"$/,`"
`)}"""`:`"""
${n?i:y(i)}
"""`}const k={Name:{leave:e=>e.value},Variable:{leave:e=>"$"+e.name},Document:{leave:e=>a(e.definitions,`

`)},OperationDefinition:{leave:e=>{const n=o("(",a(e.variableDefinitions,", "),")");return a([e.operation,a([e.name,n]),a(e.directives," ")]," ")+" "+e.selectionSet}},VariableDefinition:{leave:({variable:e,type:n,defaultValue:i,directives:t})=>e+": "+n+o(" = ",i)+o(" ",a(t," "))},SelectionSet:{leave:({selections:e})=>u(e)},Field:{leave({alias:e,name:n,arguments:i,directives:t,selectionSet:r}){const s=o("",e,": ")+n;let l=s+o("(",a(i,", "),")");return l.length>K&&(l=s+o(`(
`,y(a(i,`
`)),`
)`)),a([l,a(t," "),r]," ")}},Argument:{leave:({name:e,value:n})=>e+": "+n},FragmentSpread:{leave:({name:e,directives:n})=>"..."+e+o(" ",a(n," "))},InlineFragment:{leave:({typeCondition:e,directives:n,selectionSet:i})=>a(["...",o("on ",e),a(n," "),i]," ")},FragmentDefinition:{leave:({name:e,typeCondition:n,variableDefinitions:i,directives:t,selectionSet:r})=>`fragment ${e}${o("(",a(i,", "),")")} on ${n} ${o("",a(t," ")," ")}`+r},IntValue:{leave:({value:e})=>e},FloatValue:{leave:({value:e})=>e},StringValue:{leave:({value:e,block:n})=>n?ee(e):JSON.stringify(e)},BooleanValue:{leave:({value:e})=>e?"true":"false"},NullValue:{leave:()=>"null"},EnumValue:{leave:({value:e})=>e},ListValue:{leave:({values:e})=>"["+a(e,", ")+"]"},ObjectValue:{leave:({fields:e})=>"{"+a(e,", ")+"}"},ObjectField:{leave:({name:e,value:n})=>e+": "+n},Directive:{leave:({name:e,arguments:n})=>"@"+e+o("(",a(n,", "),")")},NamedType:{leave:({name:e})=>e},ListType:{leave:({type:e})=>"["+e+"]"},NonNullType:{leave:({type:e})=>e+"!"},SchemaDefinition:{leave:({directives:e,operationTypes:n})=>a(["schema",a(e," "),u(n)]," ")},OperationTypeDefinition:{leave:({operation:e,type:n})=>e+": "+n},ScalarTypeDefinition:{leave:({name:e,directives:n})=>a(["scalar",e,a(n," ")]," ")},ObjectTypeDefinition:{leave:({name:e,interfaces:n,directives:i,fields:t})=>a(["type",e,o("implements ",a(n," & ")),a(i," "),u(t)]," ")},FieldDefinition:{leave:({name:e,arguments:n,type:i,directives:t})=>e+(w(n)?o(`(
`,y(a(n,`
`)),`
)`):o("(",a(n,", "),")"))+": "+i+o(" ",a(t," "))},InputValueDefinition:{leave:({name:e,type:n,defaultValue:i,directives:t})=>a([e+": "+n,o("= ",i),a(t," ")]," ")},InterfaceTypeDefinition:{leave:({name:e,interfaces:n,directives:i,fields:t})=>a(["interface",e,o("implements ",a(n," & ")),a(i," "),u(t)]," ")},UnionTypeDefinition:{leave:({name:e,directives:n,types:i})=>a(["union",e,a(n," "),o("= ",a(i," | "))]," ")},EnumTypeDefinition:{leave:({name:e,directives:n,values:i})=>a(["enum",e,a(n," "),u(i)]," ")},EnumValueDefinition:{leave:({name:e,directives:n})=>a([e,a(n," ")]," ")},InputObjectTypeDefinition:{leave:({name:e,directives:n,fields:i})=>a(["input",e,a(n," "),u(i)]," ")},DirectiveDefinition:{leave:({name:e,arguments:n,repeatable:i,locations:t})=>"directive @"+e+(w(n)?o(`(
`,y(a(n,`
`)),`
)`):o("(",a(n,", "),")"))+(i?" repeatable":"")+" on "+a(t," | ")},SchemaExtension:{leave:({directives:e,operationTypes:n})=>a(["extend schema",a(e," "),u(n)]," ")},ScalarTypeExtension:{leave:({name:e,directives:n})=>a(["extend scalar",e,a(n," ")]," ")},ObjectTypeExtension:{leave:({name:e,interfaces:n,directives:i,fields:t})=>a(["extend type",e,o("implements ",a(n," & ")),a(i," "),u(t)]," ")},InterfaceTypeExtension:{leave:({name:e,interfaces:n,directives:i,fields:t})=>a(["extend interface",e,o("implements ",a(n," & ")),a(i," "),u(t)]," ")},UnionTypeExtension:{leave:({name:e,directives:n,types:i})=>a(["extend union",e,a(n," "),o("= ",a(i," | "))]," ")},EnumTypeExtension:{leave:({name:e,directives:n,values:i})=>a(["extend enum",e,a(n," "),u(i)]," ")},InputObjectTypeExtension:{leave:({name:e,directives:n,fields:i})=>a(["extend input",e,a(n," "),u(i)]," ")}};Object.keys(k).reduce((e,n)=>({...e,[n]:{leave:Z(k[n].leave)}}),{});var x;(function(e){e[e.A_SMALLER_THAN_B=-1]="A_SMALLER_THAN_B",e[e.A_EQUALS_B=0]="A_EQUALS_B",e[e.A_GREATER_THAN_B=1]="A_GREATER_THAN_B"})(x||(x={}));var p={};Object.defineProperty(p,"__esModule",{value:!0}),p.Token=p.QueryDocumentKeys=p.OperationTypeNode=p.Location=void 0,p.isNode=ae;class ne{constructor(n,i,t){this.start=n.start,this.end=i.end,this.startToken=n,this.endToken=i,this.source=t}get[Symbol.toStringTag](){return"Location"}toJSON(){return{start:this.start,end:this.end}}}p.Location=ne;class ie{constructor(n,i,t,r,s,l){this.kind=n,this.start=i,this.end=t,this.line=r,this.column=s,this.value=l,this.prev=null,this.next=null}get[Symbol.toStringTag](){return"Token"}toJSON(){return{kind:this.kind,value:this.value,line:this.line,column:this.column}}}p.Token=ie;const B={Name:[],Document:["definitions"],OperationDefinition:["name","variableDefinitions","directives","selectionSet"],VariableDefinition:["variable","type","defaultValue","directives"],Variable:["name"],SelectionSet:["selections"],Field:["alias","name","arguments","directives","selectionSet"],Argument:["name","value"],FragmentSpread:["name","directives"],InlineFragment:["typeCondition","directives","selectionSet"],FragmentDefinition:["name","variableDefinitions","typeCondition","directives","selectionSet"],IntValue:[],FloatValue:[],StringValue:[],BooleanValue:[],NullValue:[],EnumValue:[],ListValue:["values"],ObjectValue:["fields"],ObjectField:["name","value"],Directive:["name","arguments"],NamedType:["name"],ListType:["type"],NonNullType:["type"],SchemaDefinition:["description","directives","operationTypes"],OperationTypeDefinition:["type"],ScalarTypeDefinition:["description","name","directives"],ObjectTypeDefinition:["description","name","interfaces","directives","fields"],FieldDefinition:["description","name","arguments","type","directives"],InputValueDefinition:["description","name","type","defaultValue","directives"],InterfaceTypeDefinition:["description","name","interfaces","directives","fields"],UnionTypeDefinition:["description","name","directives","types"],EnumTypeDefinition:["description","name","directives","values"],EnumValueDefinition:["description","name","directives"],InputObjectTypeDefinition:["description","name","directives","fields"],DirectiveDefinition:["description","name","arguments","locations"],SchemaExtension:["directives","operationTypes"],ScalarTypeExtension:["name","directives"],ObjectTypeExtension:["name","interfaces","directives","fields"],InterfaceTypeExtension:["name","interfaces","directives","fields"],UnionTypeExtension:["name","directives","types"],EnumTypeExtension:["name","directives","values"],InputObjectTypeExtension:["name","directives","fields"]};p.QueryDocumentKeys=B;const te=new Set(Object.keys(B));function ae(e){const n=e?.kind;return typeof n=="string"&&te.has(n)}var b;p.OperationTypeNode=b,function(e){e.QUERY="query",e.MUTATION="mutation",e.SUBSCRIPTION="subscription"}(b||(p.OperationTypeNode=b={})),g`
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
`;const re=g`
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
`,oe=()=>I.sql.unsafe`
    CREATE TABLE IF NOT EXISTS ${I.sql.identifier([A])} (
      "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      "billing_address" VARCHAR(255),
      "name" VARCHAR(255),
      "schema" VARCHAR(63) DEFAULT 'public',
      "tax_id" VARCHAR(255),
      "tenant" BOOLEAN,
      "type_id" INTEGER
    );
  `,se=async e=>{await e.connect(async n=>{await n.query(oe())})},le=D(async(e,n,i)=>{const{log:t,slonik:r}=e;t.info("Registering billing-fastify plugin"),await se(r),i()});c.default=le,c.organizationResolver=M,c.organizationRoutes=H,c.organizationSchema=re,c.organizationService=d,Object.defineProperties(c,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
