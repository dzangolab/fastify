(function(i,l){typeof exports=="object"&&typeof module<"u"?l(exports,require("fastify-plugin"),require("slonik"),require("humps"),require("@dzangolab/postgres-migrations")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","slonik","humps","@dzangolab/postgres-migrations"],l):(i=typeof globalThis<"u"?globalThis:i||self,l(i.DzangolabFastifySlonik={},i.FastifyPlugin,i.Slonik,i.Humps,i.DzangolabPostgresMigrations))})(this,function(i,l,t,g,R){"use strict";const $={transformRow:(a,e,r,s)=>g.camelizeKeys(r)},m=a=>{const e={captureStackTrace:!1,connectionRetryLimit:3,connectionTimeout:5e3,idleInTransactionSessionTimeout:6e4,idleTimeout:5e3,interceptors:[],maximumPoolSize:10,queryRetryLimit:5,statementTimeout:6e4,transactionRetryLimit:5,...a};return e.interceptors=[$,...a?.interceptors??[]],e},F=async a=>{const e=a.slonik,r={database:e.db.databaseName,user:e.db.username,password:e.db.password,host:e.db.host,port:e.db.port,ensureDatabaseExists:!0,defaultDatabase:"postgres"},s="migrations";await R.migrate(r,e?.migrations?.path||s)},b=async(a,e)=>{const r=await t.createPool(a,m(e));return{connect:r.connect.bind(r),pool:r,query:r.query.bind(r)}},y=async(a,e)=>{const{connectionString:r,clientConfiguration:s}=e;let n;try{n=await b(r,s),await n.pool.connect(async()=>{a.log.info("✅ Connected to Postgres DB")})}catch(c){throw a.log.error("🔴 Error happened while connecting to Postgres DB"),new Error(c)}!a.hasDecorator("slonik")&&!a.hasDecorator("sql")&&(a.decorate("slonik",n),a.decorate("sql",t.sql)),!a.hasRequestDecorator("slonik")&&!a.hasRequestDecorator("sql")&&(a.decorateRequest("slonik",null),a.decorateRequest("sql",null),a.addHook("onRequest",async c=>{c.slonik=n,c.sql=t.sql}))},D=l(y,{fastify:"4.x",name:"fastify-slonik"});l(y,{fastify:"4.x",name:"fastify-slonik"});const L=l(async(a,e,r)=>{const s=a.config.slonik;a.log.info("Registering fastify-slonik plugin"),a.register(D,{connectionString:t.stringifyDsn(s.db),clientConfiguration:m(s?.clientConfiguration)}),a.log.info("Running database migrations"),await F(a.config),r()}),I=(a,e)=>{const r=a.key,s=a.operator||"eq",n=a.not||!1;let c=a.value;const u=t.sql.identifier([...e.names,r]);let o;switch(s){case"ct":case"sw":case"ew":{c={ct:`%${c}%`,ew:`%${c}`,sw:`${c}%`}[s],o=n?t.sql`NOT ILIKE`:t.sql`ILIKE`;break}case"eq":default:{o=n?t.sql`!=`:t.sql`=`;break}case"gt":{o=n?t.sql`<`:t.sql`>`;break}case"gte":{o=n?t.sql`<`:t.sql`>=`;break}case"lte":{o=n?t.sql`>`:t.sql`<=`;break}case"lt":{o=n?t.sql`>`:t.sql`<`;break}case"in":{o=n?t.sql`NOT IN`:t.sql`IN`,c=t.sql`(${t.sql.join(c.split(","),t.sql`, `)})`;break}case"bt":{o=n?t.sql`NOT BETWEEN`:t.sql`BETWEEN`,c=t.sql`${t.sql.join(c.split(","),t.sql` AND `)}`;break}}return t.sql`${u} ${o} ${c}`},w=(a,e,r=!1)=>{const s=[],n=[];let c;const u=(o,h,v=!1)=>{if(o.AND)for(const q of o.AND)u(q,h);else if(o.OR)for(const q of o.OR)u(q,h,!0);else{const q=I(o,h);v?n.push(q):s.push(q)}};return u(a,e,r),s.length>0&&n.length>0?c=t.sql.join([t.sql`(${t.sql.join(s,t.sql` AND `)})`,t.sql`(${t.sql.join(n,t.sql` OR `)})`],t.sql`${a.AND?t.sql` AND `:t.sql` OR `}`):s.length>0?c=t.sql.join(s,t.sql` AND `):n.length>0&&(c=t.sql.join(n,t.sql` OR `)),c?t.sql`WHERE ${c}`:t.sql``},f=(a,e)=>a?w(a,e):t.sql``,T=(a,e)=>{let r=t.sql`LIMIT ${a}`;return e&&(r=t.sql`LIMIT ${a} OFFSET ${e}`),r},p=(a,e)=>{if(e&&e.length>0){const r=[];for(const s of e){const n=s.direction==="ASC"?t.sql`ASC`:t.sql`DESC`;r.push(t.sql`${t.sql.identifier([...a.names,s.key])} ${n}`)}return t.sql`ORDER BY ${t.sql.join(r,t.sql`,`)}`}return t.sql`ORDER BY id ASC`},E=(a,e)=>t.sql`${d(a,e)}`,d=(a,e)=>t.sql.identifier(e?[e,a]:[a]),C=a=>t.sql`WHERE id = ${a}`;class S{_service;constructor(e){this._service=e}getAllSql=e=>{const r=[];for(const s of e)r.push(t.sql`${t.sql.identifier([g.decamelize(s)])}`);return t.sql`
      SELECT ${t.sql.join(r,t.sql`, `)}
      FROM ${this.getTableFragment()}
      ORDER BY id ASC;
    `};getCreateSql=e=>{const r=[],s=[];for(const n in e){const c=n,u=e[c];r.push(t.sql.identifier([g.decamelize(c)])),s.push(u)}return t.sql`
      INSERT INTO ${this.getTableFragment()}
        (${t.sql.join(r,t.sql`, `)})
      VALUES (${t.sql.join(s,t.sql`, `)})
      RETURNING *;
    `};getDeleteSql=e=>t.sql`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${e}
      RETURNING *;
    `;getFindByIdSql=e=>t.sql`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${e};
    `;getListSql=(e,r,s,n)=>{const c=d(this.table,this.schema);return t.sql`
      SELECT *
      FROM ${this.getTableFragment()}
      ${f(s,c)}
      ${p(c,n)}
      ${T(e,r)};
    `};getTableFragment=()=>E(this.table,this.schema);getUpdateSql=(e,r)=>{const s=[];for(const n in r){const c=r[n];s.push(t.sql`${t.sql.identifier([g.decamelize(n)])} = ${c}`)}return t.sql`
      UPDATE ${this.getTableFragment()}
      SET ${t.sql.join(s,t.sql`, `)}
      WHERE id = ${e}
      RETURNING *;
    `};getCount=e=>{const r=d(this.table,this.schema);return t.sql`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${f(e,r)};
    `};get config(){return this.service.config}get database(){return this.service.database}get service(){return this._service}get schema(){return this.service.schema}get table(){return this.service.table}}class N{static TABLE=void 0;static LIMIT_DEFAULT=20;static LIMIT_MAX=50;_config;_database;_factory;_schema="public";constructor(e,r,s){this._config=e,this._database=r,s&&(this._schema=s)}all=async e=>{const r=this.factory.getAllSql(e);return await this.database.connect(n=>n.any(r))};create=async e=>{const r=this.factory.getCreateSql(e),s=await this.database.connect(async n=>n.query(r).then(c=>c.rows[0]));return s?this.postCreate(s):void 0};delete=async e=>{const r=this.factory.getDeleteSql(e);return await this.database.connect(n=>n.one(r))};findById=async e=>{const r=this.factory.getFindByIdSql(e);return await this.database.connect(n=>n.maybeOne(r))};getLimitDefault=()=>this.config.slonik?.pagination?.defaultLimit||this.constructor.LIMIT_DEFAULT;getLimitMax=()=>this.config.slonik?.pagination?.maxLimit||this.constructor.LIMIT_MAX;list=async(e,r,s,n)=>{const c=this.factory.getListSql(Math.min(e??this.getLimitDefault(),this.getLimitMax()),r,s,n);return await this.database.connect(o=>o.any(c))};paginatedList=async(e,r,s,n)=>{const c=await this.list(e,r,s,n);return{totalCount:await this.count(s),data:[...c]}};count=async e=>{const r=this.factory.getCount(e);return(await this.database.connect(n=>n.any(r)))[0].count};update=async(e,r)=>{const s=this.factory.getUpdateSql(e,r);return await this.database.connect(n=>n.query(s).then(c=>c.rows[0]))};get config(){return this._config}get database(){return this._database}get factory(){if(!this.table)throw new Error("Service table is not defined");return this._factory||(this._factory=new S(this)),this.factory}get schema(){return this._schema||"public"}get table(){return this.constructor.TABLE}postCreate=async e=>e}i.BaseService=N,i.DefaultSqlFactory=S,i.createDatabase=b,i.createFilterFragment=f,i.createLimitFragment=T,i.createSortFragment=p,i.createTableFragment=E,i.createTableIdentifier=d,i.createWhereIdFragment=C,i.default=L,Object.defineProperties(i,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
