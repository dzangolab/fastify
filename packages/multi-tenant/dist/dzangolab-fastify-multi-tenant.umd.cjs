(function(c,v){typeof exports=="object"&&typeof module<"u"?v(exports,require("fastify-plugin"),require("lodash.merge"),require("supertokens-node/recipe/userroles"),require("@dzangolab/fastify-user"),require("supertokens-node"),require("@dzangolab/fastify-slonik"),require("supertokens-node/recipe/emailverification"),require("supertokens-node/recipe/thirdpartyemailpassword"),require("humps"),require("slonik"),require("zod"),require("node:fs"),require("@dzangolab/postgres-migrations"),require("pg"),require("mercurius")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","lodash.merge","supertokens-node/recipe/userroles","@dzangolab/fastify-user","supertokens-node","@dzangolab/fastify-slonik","supertokens-node/recipe/emailverification","supertokens-node/recipe/thirdpartyemailpassword","humps","slonik","zod","node:fs","@dzangolab/postgres-migrations","pg","mercurius"],v):(c=typeof globalThis<"u"?globalThis:c||self,v(c.DzangolabFastifyMultiTenant={},c.FastifyPlugin,c.LodashMerge,c.SupertokensUserRoles,c.DzangolabFastifyUser,c.SupertokensNode,c.DzangolabFastifySlonik,c.EmailVerification,c.SupertokensThirdPartyEmailPassword,c.Humps,c.Slonik,c.Zod,c.NodeFs,c.DzangolabPostgresMigrations,c.Pg,c.Mercurius))})(this,function(c,v,H,I,w,R,f,N,q,b,l,T,$,k,G,E){"use strict";function K(n){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(n){for(const e in n)if(e!=="default"){const s=Object.getOwnPropertyDescriptor(n,e);Object.defineProperty(t,e,s.get?s:{enumerable:!0,get:()=>n[e]})}}return t.default=n,Object.freeze(t)}const J=K(G),y="TENANT_OWNER",X=async()=>{await I.createNewRoleOrAddPermissions(y,[])},Y=async(n,t)=>{n.tenant=t.tenant},h=n=>{const t=n.slonik?.migrations?.path||"migrations";return{migrations:{path:n.multiTenant?.migrations?.path||`${t}/tenants`},reserved:{admin:{domains:n.multiTenant.reserved?.admin?.domains||[],enabled:n.multiTenant.reserved?.admin?.enabled??!0,slugs:n.multiTenant.reserved?.admin?.slugs||["admin"]},blacklisted:{domains:n.multiTenant.reserved?.blacklisted?.domains||[],enabled:n.multiTenant.reserved?.blacklisted?.enabled??!0,slugs:n.multiTenant.reserved?.blacklisted?.slugs||[]},others:{domains:n.multiTenant.reserved?.others?.domains||[],enabled:n.multiTenant.reserved?.others?.enabled??!0,slugs:n.multiTenant.reserved?.others?.slugs||[]},www:{domains:n.multiTenant.reserved?.www?.domains||[],enabled:n.multiTenant.reserved?.www?.enabled??!0,slugs:n.multiTenant.reserved?.www?.slugs||["www"]}},table:{name:n.multiTenant?.table?.name||"tenants",columns:{id:n.multiTenant?.table?.columns?.id||"id",domain:n.multiTenant?.table?.columns?.domain||"domain",name:n.multiTenant?.table?.columns?.name||"name",ownerId:n.multiTenant?.table?.columns?.ownerId||"owner_id",slug:n.multiTenant?.table?.columns?.slug||"slug"}}}},O={addTenantPrefix:(n,t,e)=>(e&&(t=e[h(n).table.columns.id]+"_"+t),t),removeTenantPrefix:(n,t,e)=>(e&&e[h(n).table.columns.id]==t.slice(0,Math.max(0,Math.max(0,t.indexOf("_"))))&&(t=t.slice(Math.max(0,t.indexOf("_")+1))),t)},Q=(n,t)=>{const e=t.config.appOrigin[0];return async s=>{let r;try{const a=s.userContext._default.request.request;try{const i=a.headers.referer||a.headers.origin||a.hostname;r=w.getOrigin(i)||e}catch{r=e}const o=s.emailVerifyLink.replace(e+"/auth/verify-email",r+(t.config.user.supertokens.emailVerificationPath||w.EMAIL_VERIFICATION_PATH));let d=s.user.email;a.tenant&&(d=O.removeTenantPrefix(a.config,d,a.tenant)),w.sendEmail({fastify:t,subject:"Email Verification",templateName:"email-verification",to:d,templateData:{emailVerifyLink:o}})}catch(a){a instanceof Error&&t.log.error(a.message)}}},C=(n,t,e)=>{const s=h(n),r=e?e[s.table.columns.slug]:"";return w.getUserService(n,t,r)},Z=(n,t)=>async e=>{if(n.createNewSession===void 0)throw new Error("Should never come here");const s=R.getRequestFromUserContext(e.userContext)?.original,r=e.userContext.tenant;if(s){const{config:o,slonik:d}=s,i=h(o);r&&(e.accessTokenPayload={...e.accessTokenPayload,tenantId:r[i.table.columns.id]});const g=await C(o,d,r).findById(e.userId)||void 0;if(g?.disabled)throw{name:"SIGN_IN_FAILED",message:"user is disabled",statusCode:401};e.userContext._default.request.request.user=g}const a=await n.createNewSession(e);return s&&s.config.user.features?.profileValidation?.enabled&&await a.fetchAndSetClaim(new w.ProfileValidationClaim,e.userContext),a},ee=(n,t)=>async e=>{if(n.verifySession===void 0)throw new Error("Should never come here");const s=await n.verifySession(e);if(s){const r=e.userContext._default.request.request,a=s.getAccessTokenPayload().tenantId;if(r.tenant){const d=h(r.config);if(a!=r.tenant[d.table.columns.id])throw{name:"SESSION_VERIFICATION_FAILED",message:"invalid session",statusCode:401}}if(e.userContext._default.request.request.user?.disabled)throw await s.revokeSession(),{name:"SESSION_VERIFICATION_FAILED",message:"user is disabled",statusCode:401}}return s},te=(n,t)=>async e=>{if(n.refreshPOST===void 0)throw new Error("Should never come here");const s=await n.refreshPOST(e);if(s){const r=e.userContext._default.request.request,a=s.getAccessTokenPayload().tenantId;if(r.tenant){const o=h(r.config);if(a!=r.tenant[o.table.columns.id])throw{name:"SESSION_VERIFICATION_FAILED",message:"invalid session",statusCode:401}}}return s},ne=(n,t)=>{const{config:e,log:s,slonik:r}=t;return async a=>{a.email=O.addTenantPrefix(e,a.email,a.userContext.tenant);const o=await n.emailPasswordSignIn(a);if(o.status!=="OK")return o;const d=C(e,r,a.userContext.tenant),i=await d.findById(o.user.id);return i?(i.lastLoginAt=Date.now(),await d.update(i.id,{lastLoginAt:f.formatDate(new Date(i.lastLoginAt))}).catch(g=>{s.error(`Unable to update lastLoginAt for userId ${o.user.id}`),s.error(g)}),{status:"OK",user:{...o.user,...i}}):(s.error(`User record not found for userId ${o.user.id}`),{status:"WRONG_CREDENTIALS_ERROR"})}},se=(n,t)=>async e=>{if(e.userContext.tenant=e.options.req.original.tenant,e.userContext.dbSchema=e.options.req.original.dbSchema,n.emailPasswordSignInPOST===void 0)throw new Error("Should never come here");return await n.emailPasswordSignInPOST(e)},re=(n,t)=>{const{config:e,log:s,slonik:r}=t;return async a=>{const o=a.userContext.roles||[];if(!await w.areRolesExist(o))throw s.error(`At least one role from ${o.join(", ")} does not exist.`),{name:"SIGN_UP_FAILED",message:"Something went wrong",statusCode:500};const d=a.email;a.email=O.addTenantPrefix(e,d,a.userContext.tenant);const i=await n.emailPasswordSignUp(a);if(i.status==="OK"){const u=C(e,r,a.userContext.tenant);let g;try{if(g=await u.create({id:i.user.id,email:d}),!g)throw new Error("User not found")}catch(m){throw s.error("Error while creating user"),s.error(m),await R.deleteUser(i.user.id),{name:"SIGN_UP_FAILED",message:"Something went wrong",statusCode:500}}g.roles=o,i.user={...i.user,...g};for(const m of o){const S=await I.addRoleToUser(i.user.id,m);S.status!=="OK"&&s.error(S.status)}if(e.user.features?.signUp?.emailVerification)try{if(a.userContext.autoVerifyEmail)await w.verifyEmail(g.id);else{const m=await N.createEmailVerificationToken(i.user.id);m.status==="OK"&&await N.sendEmail({type:"EMAIL_VERIFICATION",user:{id:i.user.id,email:a.email},emailVerifyLink:`${e.appOrigin[0]}/auth/verify-email?token=${m.token}&rid=emailverification`,userContext:a.userContext})}}catch(m){s.error(m)}}if(e.user.supertokens.sendUserAlreadyExistsWarning&&i.status==="EMAIL_ALREADY_EXISTS_ERROR")try{w.sendEmail({fastify:t,subject:"Duplicate Email Registration",templateData:{emailId:d},templateName:"duplicate-email-warning",to:d})}catch(u){s.error(u)}return i}},A=n=>{let t;try{if(t=new URL(n).host,!t)throw new Error("Host is empty")}catch{t=n}return t},ae=(n,t)=>async e=>{const s=e.options.req.original,r=s.headers.referer||s.headers.origin||s.hostname,a=A(r),{admin:o,www:d}=h(s.config).reserved;if(e.userContext.roles=d.enabled&&(d.slugs.some(i=>`${i}.${s.config.multiTenant.rootDomain}`===a)||d.domains.includes(a))?[y]:[s.config.user.role||w.ROLE_USER],o.enabled&&(o.slugs.some(i=>`${i}.${s.config.multiTenant.rootDomain}`===a)||o.domains.includes(a)))throw{name:"SIGN_UP_FAILED",message:"Admin signUp is not allowed",statusCode:403};if(e.userContext.tenant=s.tenant,n.emailPasswordSignUpPOST===void 0)throw new Error("Should never come here");if(t.config.user.features?.signUp?.enabled===!1)throw{name:"SIGN_UP_DISABLED",message:"SignUp feature is currently disabled",statusCode:404};return await n.emailPasswordSignUpPOST(e)},oe=(n,t,e)=>(e&&t.find(s=>{s.id==="email"&&(s.value=e[h(n).table.columns.id]+"_"+s.value)}),t),D={emailVerification:{sendEmail:Q},thirdPartyEmailPassword:{override:{apis:{emailPasswordSignInPOST:se,emailPasswordSignUpPOST:ae,generatePasswordResetTokenPOST:(n,t)=>async e=>{if(e.userContext.tenant=e.options.req.original.tenant,n.generatePasswordResetTokenPOST===void 0)throw new Error("Should never come here");return e.formFields=oe(t.config,e.formFields,e.userContext.tenant),await n.generatePasswordResetTokenPOST(e)},thirdPartySignInUpPOST:(n,t)=>{const{config:e,log:s,slonik:r}=t;return async a=>{const o=a.options.req.original,d=o.headers.referer||o.headers.origin||o.hostname,i=A(d),{admin:u,www:g}=h(o.config).reserved;if(a.userContext.roles=g.enabled&&(g.slugs.some(S=>`${S}.${o.config.multiTenant.rootDomain}`===i)||g.domains.includes(i))?[y]:[o.config.user.role||w.ROLE_USER],u.enabled&&(u.slugs.some(S=>`${S}.${o.config.multiTenant.rootDomain}`===i)||u.domains.includes(i)))throw{name:"SIGN_UP_FAILED",message:"Admin signUp is not allowed",statusCode:403};if(a.userContext.tenant=o.tenant,n.thirdPartySignInUpPOST===void 0)throw new Error("Should never come here");const m=await n.thirdPartySignInUpPOST(a);if(m.status==="OK"){const P=await C(e,r,o.tenant).findById(m.user.id);return P?{...m,user:{...m.user,...P}}:(s.error(`User record not found for userId ${m.user.id}`),{status:"GENERAL_ERROR",message:"Something went wrong"})}return m}}},functions:{emailPasswordSignIn:ne,emailPasswordSignUp:re,getUserById:(n,t)=>async e=>{let s=await n.getUserById(e);return s&&e.userContext&&e.userContext.tenant&&(s={...s,email:O.removeTenantPrefix(t.config,s.email,e.userContext.tenant)}),s},resetPasswordUsingToken:(n,t)=>async e=>{const s=await n.resetPasswordUsingToken(e);if(s.status==="OK"&&s.userId){const r=await q.getUserById(s.userId,{tenant:e.userContext._default.request.request.tenant});r&&w.sendEmail({fastify:t,subject:"Reset Password Notification",templateName:"reset-password-notification",to:r.email,templateData:{emailId:r.email}})}return s},thirdPartySignInUp:(n,t)=>{const{config:e,log:s,slonik:r}=t;return async a=>{const o=a.userContext.roles||[],d=a.userContext.tenant;if(d){const m=d[h(e).table.columns.id];a.thirdPartyUserId=m+"_"+a.thirdPartyUserId}if(!await q.getUserByThirdPartyInfo(a.thirdPartyId,a.thirdPartyUserId,a.userContext)&&e.user.features?.signUp?.enabled===!1)throw{name:"SIGN_UP_DISABLED",message:"SignUp feature is currently disabled",statusCode:404};const u=await n.thirdPartySignInUp(a),g=C(e,r,d);if(u.createdNewUser){if(!await w.areRolesExist(o))throw await R.deleteUser(u.user.id),s.error(`At least one role from ${o.join(", ")} does not exist.`),{name:"SIGN_UP_FAILED",message:"Something went wrong",statusCode:500};for(const S of o){const P=await I.addRoleToUser(u.user.id,S);P.status!=="OK"&&s.error(P.status)}let m;try{if(m=await g.create({id:u.user.id,email:u.user.email}),!m)throw new Error("User not found")}catch(S){throw s.error("Error while creating user"),s.error(S),await R.deleteUser(u.user.id),{name:"SIGN_UP_FAILED",message:"Something went wrong",statusCode:500}}}else await g.update(u.user.id,{lastLoginAt:w.formatDate(new Date(Date.now()))}).catch(m=>{s.error(`Unable to update lastLoginAt for userId ${u.user.id}`),s.error(m)});return u}}}},sendEmail:(n,t)=>{const e=t.config.appOrigin[0];return async s=>{const r=s.userContext._default.request.request;let a;if(r.query.appId){const u=Number(r.query.appId);a=t.config.apps?.find(g=>g.id===u)}const o=a?.origin||r.headers.referer||r.headers.origin||r.hostname,d=w.getOrigin(o)||e,i=s.passwordResetLink.replace(e+"/auth/reset-password",d+(t.config.user.supertokens.resetPasswordPath||w.RESET_PASSWORD_PATH));w.sendEmail({fastify:t,subject:"Reset Password",templateName:"reset-password",to:O.removeTenantPrefix(r.config,s.user.email,s.userContext.tenant),templateData:{passwordResetLink:i}})}}},session:{override:{apis:{refreshPOST:te,verifySession:ee},functions:{createNewSession:Z}}}},L=n=>{const t=h(n).reserved;let e=[];for(const[,s]of Object.entries(t))s.enabled&&(e=[...e,...s.domains]);return e},U=n=>{const t=h(n).reserved;let e=[];for(const[,s]of Object.entries(t))s.enabled&&(e=[...e,...s.slugs]);return e};class ie extends f.DefaultSqlFactory{fieldMappings=new Map(Object.entries({domain:"domain",id:"id",name:"name",ownerId:"owner_id",slug:"slug"}));constructor(t){super(t),this.init()}getAllWithAliasesSql=t=>{const e=[];for(const i of t)i!="host"&&e.push(l.sql.fragment`${this.getAliasedField(i)}`);const s=f.createTableIdentifier(this.table,this.schema),r=l.sql.identifier([this.getMappedField("domain")]),a=l.sql.identifier([this.getMappedField("slug")]),o=this.config.multiTenant.rootDomain,d=t.includes("host")?l.sql.fragment`,
          CASE
            WHEN ${r} IS NOT NULL THEN ${r}
            ELSE CONCAT(${a}, ${"."+o}::TEXT)
          END AS host
        `:l.sql.fragment``;return l.sql.type(T.z.any())`
      SELECT ${l.sql.join(e,l.sql.fragment`, `)}
        ${d}
      FROM ${this.getTableFragment()}
      ${f.createFilterFragment(this.filterWithOwnerId(),s)}
      ORDER BY ${l.sql.identifier([b.decamelize(this.getMappedField("id"))])} ASC;
    `};getCountSql=t=>{const e=f.createTableIdentifier(this.table,this.schema),s=T.z.object({count:T.z.number()});return l.sql.type(s)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${f.createFilterFragment(this.filterWithOwnerId(t),e)};
    `};getCreateSql=t=>{const e=[],s=[];for(const r in t){const a=r,o=t[a];e.push(l.sql.identifier([b.decamelize(this.getMappedField(a))])),s.push(o)}return l.sql.type(T.z.any())`
      INSERT INTO ${this.getTableFragment()}
        (${l.sql.join(e,l.sql.fragment`, `)})
      VALUES (${l.sql.join(s,l.sql.fragment`, `)})
      RETURNING *;
    `};getFindByHostnameSql=(t,e)=>l.sql.type(T.z.any())`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE ${l.sql.identifier([b.decamelize(this.getMappedField("domain"))])} = ${t}
      OR (
        ${l.sql.identifier([b.decamelize(this.getMappedField("slug"))])}
        || '.' ||
        ${e}
      ) = ${t};
    `;getFindByIdSql=t=>{const e={key:this.getMappedField("id"),operator:"eq",value:t},s=f.createTableIdentifier(this.table,this.schema);return l.sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${f.createFilterFragment(this.filterWithOwnerId(e),s)}
    `};getFindBySlugOrDomainSql=(t,e)=>{const s=l.sql.identifier([this.getMappedField("domain")]),r=l.sql.identifier([this.getMappedField("slug")]),a=e?l.sql.fragment`
        OR ${s} = ${e}
      `:l.sql.fragment``;return l.sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE
      ${r} = ${t}
      ${a};
    `};getListSql=(t,e,s,r)=>{const a=f.createTableIdentifier(this.table,this.schema);return l.sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${f.createFilterFragment(this.filterWithOwnerId(s),a)}
      ${f.createSortFragment(a,this.getSortInput(r))}
      ${f.createLimitFragment(t,e)};
    `};getAliasedField=t=>{const e=this.getMappedField(t);return e===t?l.sql.identifier([b.decamelize(t)]):l.sql.join([l.sql.identifier([b.decamelize(e)]),l.sql.identifier([t])],l.sql.fragment` AS `)};getMappedField=t=>this.fieldMappings.has(t)?this.fieldMappings.get(t):t;init(){const t=this.config.multiTenant?.table?.columns;if(t)for(const e in t){const s=e;this.fieldMappings.set(s,t[s])}}filterWithOwnerId(t){if(this.ownerId){const e={key:this.getMappedField("ownerId"),operator:"eq",value:this.ownerId};return t?{AND:[e,t]}:e}return t}get ownerId(){return this.service.ownerId}}const M=n=>{let t={database:n.db.databaseName,user:n.db.username,password:n.db.password,host:n.db.host,port:n.db.port};return n.clientConfiguration?.ssl&&(t={...t,ssl:n.clientConfiguration?.ssl}),t},x=async(n,t)=>{await n.query(`
      CREATE SCHEMA IF NOT EXISTS ${t};
      SET search_path TO ${t};
    `)},z=async n=>{const t=new J.Client(n);return await t.connect(),t},V=async(n,t,e)=>{if(!$.existsSync(t))return!1;const s="client"in n?n.client:await z(n);return await x(s,e.slug),await k.migrate({client:s},t),"client"in n||await s.end(),!0},F=T.z.optional(T.z.string().max(255).regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/)),j=T.z.string().regex(/^(?!.*-+$)[a-z][\da-z-]{0,61}([\da-z])?$/),W=(n,t)=>{const e=h(n).table.columns,s={slug:t[e.slug],domain:t[e.domain]},a=T.z.object({slug:j,domain:F}).safeParse(s);if(!a.success)throw a.error.issues.some(o=>o.path.includes("slug"))?{name:"ERROR_INVALID_SLUG",message:"Invalid slug",statusCode:422}:{name:"ERROR_INVALID_DOMAIN",message:"Invalid domain",statusCode:422}},de=Object.freeze(Object.defineProperty({__proto__:null,domainSchema:F,slugSchema:j,validateTenantInput:W,validateTenantUpdate:(n,t)=>{const e=h(n).table.columns,s={domain:t[e.domain]};if(!T.z.object({domain:F}).safeParse(s).success)throw{name:"ERROR_INVALID_DOMAIN",message:"Invalid domain",statusCode:422}}},Symbol.toStringTag,{value:"Module"}));class p extends f.BaseService{_ownerId=void 0;all=async t=>{const e=this.factory.getAllWithAliasesSql(t);return await this.database.connect(r=>r.any(e))};create=async t=>{const e=h(this.config),{slug:s,domain:r}=e.table.columns;if(t[r]===""&&delete t[r],W(this.config,t),U(this.config).includes(t[s]))throw{name:"ERROR_RESERVED_SLUG",message:`The requested ${s} "${t[s]}" is reserved and cannot be used`,statusCode:422};if(L(this.config).includes(t[r]))throw{name:"ERROR_RESERVED_DOMAIN",message:`The requested ${r} "${t[r]}" is reserved and cannot be used`,statusCode:422};await this.validateSlugOrDomain(t[s],t[r]);const a=this.factory.getCreateSql(t),o=await this.database.connect(async d=>d.query(a).then(i=>i.rows[0]));return o?this.postCreate(o):void 0};findByHostname=async t=>{const e=this.factory.getFindByHostnameSql(t,this.config.multiTenant.rootDomain);return await this.database.connect(async r=>r.maybeOne(e))};validateSlugOrDomain=async(t,e)=>{const s=this.factory.getFindBySlugOrDomainSql(t,e),r=await this.database.connect(async a=>a.any(s));if(r.length>0){const a=h(this.config),{slug:o,domain:d}=a.table.columns;throw r.some(i=>i[o]===t)?{name:"ERROR_SLUG_ALREADY_EXISTS",message:`The specified ${o} "${t}" already exits`,statusCode:422}:{name:"ERROR_DOMAIN_ALREADY_EXISTS",message:`The specified ${d} "${e}" already exits`,statusCode:422}}};get factory(){if(!this.table)throw new Error("Service table is not defined");return this._factory||(this._factory=new ie(this)),this._factory}get sortKey(){return this.config.multiTenant.table?.columns?.id||super.sortKey}get ownerId(){return this._ownerId}set ownerId(t){this._ownerId=t}get table(){return this.config.multiTenant?.table?.name||"tenants"}postCreate=async t=>{const e=h(this.config);return await V(M(this.config.slonik),e.migrations.path,t),t}}const le=async(n,t,e)=>{if(L(n).includes(e)||U(n).some(a=>`${a}.${n.multiTenant.rootDomain}`===e))return null;const r=await new p(n,t).findByHostname(e);if(r)return r;throw new Error("Tenant not found")},ce=v(async(n,t,e)=>{n.addHook("preHandler",async(s,r)=>{const a=s.headers.referer||s.headers.origin||s.hostname,{config:o,slonik:d}=s;try{const i=await le(o,d,A(a));i&&(s.tenant=i,s.dbSchema=i[h(o).table.columns.slug])}catch(i){return n.log.error(i),r.status(404).send({error:{message:"Tenant not found"}})}}),e()}),B=v(async(n,t,e)=>{n.log.info("Registering fastify-multi-tenant plugin"),await n.register(ce);const{config:s}=n,r={recipes:D};s.user.supertokens=H(r,s.user.supertokens),n.addHook("onReady",async()=>{await X()}),e()});B.updateContext=Y;const ue=v(async(n,t,e)=>{try{const{config:s,slonik:r}=n,a=M(s.slonik),d=h(s).migrations.path;if($.existsSync(d)){const u=await new p(s,r).all(["name","slug"]),g=await z(a);for(const m of u)n.log.info(`Running migrations for tenant ${m.name}`),await V({client:g},d,m);await x(g,"public"),await g.end()}else n.log.warn(`Tenant migrations path '${d}' does not exists.`)}catch(s){throw n.log.error("🔴 multi-tenant: Failed to run tenant migrations"),s}e()}),me={Mutation:{createTenant:async(n,t,e)=>{if(e.tenant)return new E.ErrorWithProps("Tenant app cannot be used to create tenant",void 0,403);const s=e.user?.id;if(s){const r=t.data,a=h(e.config);return r[a.table.columns.ownerId]=s,await new p(e.config,e.database,e.dbSchema).create(r).catch(d=>new E.ErrorWithProps(d.message,void 0,d.statusCode))}else{e.app.log.error("Could not able to get user id from mercurius context");const r=new E.ErrorWithProps("Oops, Something went wrong");return r.statusCode=500,r}}},Query:{allTenants:async(n,t,e)=>{if(e.tenant)return new E.ErrorWithProps("Tenant app cannot display all tenants",void 0,403);const s=e.user?.id;if(!s)return new E.ErrorWithProps("Oops, Something went wrong",void 0,500);const r=new p(e.config,e.database,e.dbSchema),{roles:a}=await I.getRolesForUser(s);return a.includes(y)&&(r.ownerId=s),await r.all(JSON.parse(JSON.stringify(t.fields)))},tenant:async(n,t,e)=>{if(e.tenant)return new E.ErrorWithProps("Tenant app cannot retrieve tenant information",void 0,403);const s=e.user?.id;if(!s)return new E.ErrorWithProps("Oops, Something went wrong",void 0,500);const r=new p(e.config,e.database,e.dbSchema),{roles:a}=await I.getRolesForUser(s);return a.includes(y)&&(r.ownerId=s),await r.findById(t.id)},tenants:async(n,t,e)=>{if(e.tenant)return new E.ErrorWithProps("Tenant app cannot display a list of tenants",void 0,403);const s=e.user?.id;if(!s)return new E.ErrorWithProps("Oops, Something went wrong",void 0,500);const r=new p(e.config,e.database,e.dbSchema),{roles:a}=await I.getRolesForUser(s);return a.includes(y)&&(r.ownerId=s),await r.list(t.limit,t.offset,t.filters?JSON.parse(JSON.stringify(t.filters)):void 0,t.sort?JSON.parse(JSON.stringify(t.sort)):void 0)}}},_={all:async(n,t)=>{if(n.tenant)throw{name:"GET_ALL_TENANTS_FAILED",message:"Tenant app cannot display all tenants",statusCode:403};const e=n.session?.getUserId();if(!e)throw n.log.error("could not get user id from session"),new Error("Oops, Something went wrong");const s=new p(n.config,n.slonik,n.dbSchema),{roles:r}=await I.getRolesForUser(e);r.includes(y)&&(s.ownerId=e);const{fields:a}=n.query,o=await s.all(JSON.parse(a));t.send(o)},create:async(n,t)=>{if(n.tenant)throw{name:"CREATE_TENANT_FAILED",message:"Tenant app cannot be used to create tenant",statusCode:403};const e=n.session?.getUserId();if(e){const s=n.body,r=h(n.config);s[r.table.columns.ownerId]=e;const o=await new p(n.config,n.slonik).create(s);t.send(o)}else throw n.log.error("could not get user id from session"),new Error("Oops, Something went wrong")},tenant:async(n,t)=>{if(n.tenant)throw{name:"GET_TENANT_FAILED",message:"Tenant app cannot retrieve tenant information",statusCode:403};const e=n.session?.getUserId();if(!e)throw n.log.error("could not get user id from session"),new Error("Oops, Something went wrong");const s=new p(n.config,n.slonik,n.dbSchema),{roles:r}=await I.getRolesForUser(e);r.includes(y)&&(s.ownerId=e);const{id:a}=n.params,o=await s.findById(a);t.send(o)},tenants:async(n,t)=>{if(n.tenant)throw{name:"LIST_TENANTS_FAILED",message:"Tenant app cannot display a list of tenants",statusCode:403};const e=n.session?.getUserId();if(!e)throw n.log.error("could not get user id from session"),new Error("Oops, Something went wrong");const s=new p(n.config,n.slonik,n.dbSchema),{roles:r}=await I.getRolesForUser(e);r.includes(y)&&(s.ownerId=e);const{limit:a,offset:o,filters:d,sort:i}=n.query,u=await s.list(a,o,d?JSON.parse(d):void 0,i?JSON.parse(i):void 0);t.send(u)}},ge=async(n,t,e)=>{n.get("/tenants/all",{preHandler:n.verifySession()},_.all),n.get("/tenants",{preHandler:n.verifySession()},_.tenants),n.get("/tenants/:id(^\\d+)",{preHandler:n.verifySession()},_.tenant),n.post("/tenants",{preHandler:n.verifySession()},_.create),e()};c.TenantService=p,c.default=B,c.tenantMigrationPlugin=ue,c.tenantResolver=me,c.tenantRoutes=ge,c.thirdPartyEmailPassword=D,c.validateTenantSchema=de,Object.defineProperties(c,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
