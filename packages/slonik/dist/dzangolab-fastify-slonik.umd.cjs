(function(i,d){typeof exports=="object"&&typeof module<"u"?d(exports,require("fastify-plugin"),require("slonik"),require("pg-node-migrations")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","slonik","pg-node-migrations"],d):(i=typeof globalThis<"u"?globalThis:i||self,d(i.DzangolabFastifySlonik={},i.FastifyPlugin,i.Slonik,i.pgNodeMigrations))})(this,function(i,d,t,h){"use strict";var E=async(e,c)=>{const{connectionString:u}=c;let r;try{r=await t.createPool(u)}catch(a){throw e.log.error("🔴 Error happened while connecting to Postgres DB"),new Error(a)}try{await r.connect(async()=>{e.log.info("✅ Connected to Postgres DB")})}catch{e.log.error("🔴 Error happened while connecting to Postgres DB")}const n={connect:r.connect.bind(r),pool:r,query:r.query.bind(r)};!e.hasDecorator("slonik")&&!e.hasDecorator("sql")&&(e.decorate("slonik",n),e.decorate("sql",t.sql)),!e.hasRequestDecorator("slonik")&&!e.hasRequestDecorator("sql")&&(e.decorateRequest("slonik",null),e.decorateRequest("sql",null),e.addHook("onRequest",async a=>{a.slonik=n,a.sql=t.sql}))};d(E,{fastify:"4.x",name:"fastify-slonik"});var F=d(E,{fastify:"4.x",name:"fastify-slonik"});const D=d(async(e,c,u)=>{const r=e.config.slonik;try{e.log.info("Registering fastify-slonik plugin"),e.register(F,{connectionString:t.stringifyDsn(r.db)})}catch(n){throw e.log.error("🔴 Failed to connect, check your connection string"),n}u()}),S=(e,c)=>{const u=e.key,r=e.operator||"eq",n=e.not||!1;let a=e.value;const s=t.sql.identifier([c,u]);let o;switch(r){case"ct":case"sw":case"ew":{a={ct:`%${a}%`,ew:`%${a}`,sw:`${a}%`}[r],o=n?t.sql`NOT ILIKE`:t.sql`ILIKE`;break}case"eq":default:{o=n?t.sql`!=`:t.sql`=`;break}case"gt":{o=n?t.sql`<`:t.sql`>`;break}case"gte":{o=n?t.sql`<`:t.sql`>=`;break}case"lte":{o=n?t.sql`>`:t.sql`<=`;break}case"lt":{o=n?t.sql`>`:t.sql`<`;break}case"in":{o=n?t.sql`NOT IN`:t.sql`IN`,a=t.sql`(${t.sql.join(a.split(","),t.sql`, `)})`;break}case"bt":{o=n?t.sql`NOT BETWEEN`:t.sql`BETWEEN`,a=t.sql`${t.sql.join(a.split(","),t.sql` AND `)}`;break}}return t.sql`${s} ${o} ${a}`},T=(e,c,u=!1)=>{const r=[],n=[];let a;const s=(o,l,p=!1)=>{if(o.AND)for(const q of o.AND)s(q,l);else if(o.OR)for(const q of o.OR)s(q,l,!0);else{const q=S(o,l);p?n.push(q):r.push(q)}};return s(e,c,u),r.length>0&&n.length>0?a=t.sql.join([t.sql`(${t.sql.join(r,t.sql` AND `)})`,t.sql`(${t.sql.join(n,t.sql` OR `)})`],t.sql`${e.AND?t.sql` AND `:t.sql` OR `}`):r.length>0?a=t.sql.join(r,t.sql` AND `):n.length>0&&(a=t.sql.join(n,t.sql` OR `)),a?t.sql`WHERE ${a}`:t.sql``},$=(e,c)=>{let u=t.sql`LIMIT ${e}`;return c&&(u=t.sql`LIMIT ${e} OFFSET ${c}`),u},g=e=>t.sql`${t.sql.identifier([e])}`,f=e=>t.sql`WHERE id = ${e}`,w=(e,c)=>e?T(e,c):t.sql``,O=(e,c)=>{if(c&&c.length>0){const u=[];for(const r of c){const n=r.direction==="ASC"?t.sql`ASC`:t.sql`DESC`;u.push(t.sql`${t.sql.identifier([e,r.key])} ${n}`)}return t.sql`ORDER BY ${t.sql.join(u,t.sql`,`)}`}return t.sql`ORDER BY id ASC`},y=(e,c,u)=>({all:r=>{const n=[];for(const a of r)n.push(e`${e.identifier([a])}`);return e`
        SELECT ${e.join(n,e`, `)}
        FROM ${g(c)}
        ORDER BY id ASC
      `},create:r=>{const n=[],a=[];for(const o in r){const l=o,p=r[l];n.push(l),a.push(p)}const s=n.map(o=>e.identifier([o]));return e`
        INSERT INTO ${g(c)}
        (${e.join(s,e`, `)}, created_at, updated_at)
        VALUES (${e.join(a,e`, `)}, NOW(), NOW())
        RETURNING *;
      `},delete:r=>e`
        DELETE FROM ${g(c)}
        WHERE id = ${r}
        RETURNING *;
      `,findById:r=>e`
        SELECT *
        FROM ${g(c)}
        WHERE id = ${r}
      `,list:(r,n,a,s)=>e`
        SELECT *
        FROM ${g(c)}
        ${w(a,c)}
        ${O(c,s)}
        ${$(Math.min(r??u.pagination.default_limit,u?.pagination.max_limit),n)};
      `,update:(r,n)=>{const a=[];for(const s in n){const o=n[s];a.push(e`${e.identifier([s])} = ${o}`)}return e`
        UPDATE ${g(c)}
        SET ${e.join(a,e`, `)}
        WHERE id = ${r}
        RETURNING *;
      `}}),I="tenants",m=(e,c,u)=>{const r=y(u,I,e);return{all:async()=>{const n=r.all(["id","name","slug"]);return await c.connect(s=>s.any(n))},create:async n=>{const a=r.create(n);return await c.connect(async s=>s.query(a).then(o=>o.rows[0]))},delete:async n=>{const a=r.delete(n);return await c.connect(o=>o.one(a))},findById:async n=>{const a=r.findById(n);return await c.connect(o=>o.maybeOne(a))},update:async(n,a)=>{const s=r.update(n,a);return await c.connect(o=>o.query(s).then(l=>l.rows[0]))}}},R=e=>({database:e.db.databaseName,user:e.db.username,password:e.db.password,host:e.db.host,port:e.db.port,ensureDatabaseExists:!0,defaultDatabase:"postgres"}),b=d(async(e,c,u)=>{try{e.log.info("Running database migrations");const r=R(e.config.slonik),n=e.config.slonik.migrations.path;await h.migrate(r,n);const s=await m(e.config,e.slonik,t.sql).all();for(const o of s.values())await h.migrate(r,n+"/tenants",{schemaName:o.slug})}catch(r){throw e.log.error("🔴 Failed to run the migrations"),r}u()});i.SqlFactory=y,i.TenantService=m,i.createLimitFragment=$,i.createTableFragment=g,i.createWhereIdFragment=f,i.default=D,i.getMigrateDatabaseConfig=R,i.migratePlugin=b,Object.defineProperties(i,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
