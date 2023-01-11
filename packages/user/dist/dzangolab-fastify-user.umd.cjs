(function(n,r){typeof exports=="object"&&typeof module<"u"?r(exports,require("@dzangolab/fastify-mercurius"),require("fastify-plugin"),require("@dzangolab/fastify-slonik")):typeof define=="function"&&define.amd?define(["exports","@dzangolab/fastify-mercurius","fastify-plugin","@dzangolab/fastify-slonik"],r):(n=typeof globalThis<"u"?globalThis:n||self,r(n.DzangolabFastifyUser={},n.DzangolabFastifyConfig,n.FastifyPlugin,n.DzangolabFastifySlonik))})(this,function(n,r,y,u){"use strict";const d="users",o=(i,s,e)=>({findById:async t=>{const a=e`
        SELECT *
        FROM ${u.createTableFragment(d)}
        ${u.createWhereIdFragment(t)}
      `;return await s.connect(l=>l.maybeOne(a))},list:async(t=i.pagination.default_limit,a)=>{const c=e`
        SELECT *
        FROM ${u.createTableFragment(d)}
        ORDER BY id ASC
        ${u.createLimitFragment(Math.min(t??i.pagination.default_limit,i?.pagination.max_limit),a)};
      `;return await s.connect(f=>f.any(c))}}),g=async(i,s,e)=>{i.get("/users",{preHandler:i.verifySession()},async(t,a)=>{const c=o(t.config,t.slonik,t.sql),{limit:l,offset:f}=t.query,b=await c.list(l,f);a.send(b)}),e()},p=y((i,s,e)=>{i.register(g),e()}),m={Query:{user:async(i,s,e)=>await o(e.config,e.database,e.sql).findById(s.id),users:async(i,s,e)=>await o(e.config,e.database,e.sql).list(s.limit,s.offset)}};n.default=p,n.userResolver=m,n.userService=o,Object.defineProperties(n,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
