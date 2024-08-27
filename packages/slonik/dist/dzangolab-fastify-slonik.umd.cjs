(function(c,g){typeof exports=="object"&&typeof module<"u"?g(exports,require("fastify-plugin"),require("slonik"),require("humps"),require("zod"),require("@dzangolab/postgres-migrations"),require("pg")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","slonik","humps","zod","@dzangolab/postgres-migrations","pg"],g):(c=typeof globalThis<"u"?globalThis:c||self,g(c.DzangolabFastifySlonik={},c.FastifyPlugin,c.Slonik,c.Humps,c.Zod,c.DzangolabPostgresMigrations,c.pg))})(this,function(c,g,e,u,_,$,I){"use strict";function C(a){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(a){for(const r in a)if(r!=="default"){const n=Object.getOwnPropertyDescriptor(a,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:()=>a[r]})}}return t.default=a,Object.freeze(t)}const F=C(I),L={transformRow:(a,t,r,n)=>u.camelizeKeys(r)},D={transformRow:(a,t,r,n)=>{const{resultParser:s}=a;if(!s)return r;const i=s.safeParse(r);if(!i.success)throw new e.SchemaValidationError(t,r,i.error.issues);return i.data}},v=a=>Number.parseInt(a,10),b=()=>({name:"int8",parse:v}),p=a=>{const t={captureStackTrace:!1,connectionRetryLimit:3,connectionTimeout:5e3,idleInTransactionSessionTimeout:6e4,idleTimeout:5e3,interceptors:[],maximumPoolSize:10,queryRetryLimit:5,statementTimeout:6e4,transactionRetryLimit:5,typeParsers:[...e.createTypeParserPreset(),b()],...a};return t.interceptors=[L,D,...a?.interceptors??[]],t},w=e.sql.unsafe`
  /* Update updated_at column for a table. */

  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  /* Add trigger to update updated_at for all tables (matching the filters). */

  CREATE OR REPLACE FUNCTION create_updated_at_trigger_to_all_tables()
  RETURNS void AS $$
  DECLARE
    table_name TEXT;
  DECLARE
    table_schema TEXT;
  BEGIN
    FOR table_name, table_schema IN
      SELECT
        c.table_name,
        c.table_schema
      FROM
        information_schema.columns c
        join information_schema.tables as t
        ON
        t.table_name = c.table_name
      WHERE
            c.column_name = 'updated_at'
            AND t.table_schema NOT IN ('pg_catalog', 'information_schema')
            AND t.table_schema NOT LIKE 'pg_toast%'
            AND t.table_schema NOT LIKE'pg_temp_%'
    LOOP
      IF NOT Exists(
          SELECT
            trigger_name
          FROM
            information_schema.triggers
          WHERE
            event_object_table = table_name
            AND trigger_name = CONCAT(table_name,'_updated_at_trigger')
            AND event_object_schema = table_schema
          )
      THEN
        EXECUTE 'CREATE OR REPLACE TRIGGER ' || table_name || '_updated_at_trigger BEFORE UPDATE ON ' || table_schema || '.' || table_name || ' FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
      END IF;
    END LOOP;
  END;
  $$ LANGUAGE plpgsql;

  /* Execute create_updated_at_trigger_to_all_tables as a Function. */

  CREATE OR REPLACE FUNCTION add_updated_at_trigger_to_all_existing_tables()
  RETURNS void AS $$
  BEGIN
    EXECUTE public.create_updated_at_trigger_to_all_tables();
  END;
  $$ LANGUAGE plpgsql;

  /* Add trigger to all existing tables. */

  SELECT add_updated_at_trigger_to_all_existing_tables();

  /* Execute create_updated_at_trigger_to_all_tables as a Trigger */

  CREATE OR REPLACE FUNCTION add_updated_at_trigger_to_all_tables()
  RETURNS event_trigger AS $$
  BEGIN
    EXECUTE public.create_updated_at_trigger_to_all_tables();
  END;
  $$ LANGUAGE plpgsql;

  DROP EVENT TRIGGER IF EXISTS on_create_or_update_table;

  /* Add trigger to add trigger to update updated_at in new table or altered table. */

  CREATE EVENT TRIGGER
  on_create_or_update_table ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'ALTER TABLE')
  EXECUTE FUNCTION add_updated_at_trigger_to_all_tables();

  /*
    Here, the difference between add_updated_at_trigger_to_all_existing_tables
    and add_updated_at_trigger_to_all_tables is that
    add_updated_at_trigger_to_all_existing_tables is a function and executes
    create_updated_at_trigger_to_all_tables as function discernible by its return type
    RETURNS void AS $$.

    But, add_updated_at_trigger_to_all_tables returns
    create_updated_at_trigger_to_all_tables as a trigger discernible by its return type
    RETURNS event_trigger AS $$.
  */
`,U=async a=>{await a.connect(async t=>{await t.query(w)})},T=async(a,t)=>{const r=await e.createPool(a,p(t));return{connect:r.connect.bind(r),pool:r,query:r.query.bind(r)}},y=async(a,t)=>{const{connectionString:r,clientConfiguration:n}=t;let s;try{s=await T(r,n),await s.pool.connect(async()=>{a.log.info("✅ Connected to Postgres DB")})}catch(i){throw a.log.error("🔴 Error happened while connecting to Postgres DB"),new Error(i)}!a.hasDecorator("slonik")&&!a.hasDecorator("sql")&&(a.decorate("slonik",s),a.decorate("sql",e.sql)),!a.hasRequestDecorator("slonik")&&!a.hasRequestDecorator("sql")&&(a.decorateRequest("slonik",null),a.decorateRequest("sql",null),a.addHook("onRequest",async i=>{i.slonik=s,i.sql=e.sql}))},P=g(y,{fastify:"4.x",name:"fastify-slonik"});g(y,{fastify:"4.x",name:"fastify-slonik"});const j=g(async(a,t,r)=>{const n=a.config.slonik;a.log.info("Registering fastify-slonik plugin"),await a.register(P,{connectionString:e.stringifyDsn(n.db),clientConfiguration:p(n?.clientConfiguration)}),n.migrations?.package!==!1&&await U(a.slonik),a.decorateRequest("dbSchema",""),r()}),R=(a,t)=>{const r=u.decamelize(t.key),n=t.operator||"eq",s=t.not||!1;let i=t.value;const l=e.sql.identifier([...a.names,r]);let o;if(n==="eq"&&["null","NULL"].includes(i))return o=s?e.sql.fragment`IS NOT NULL`:e.sql.fragment`IS NULL`,e.sql.fragment`${l} ${o}`;switch(n){case"ct":case"sw":case"ew":{i={ct:`%${i}%`,ew:`%${i}`,sw:`${i}%`}[n],o=s?e.sql.fragment`NOT ILIKE`:e.sql.fragment`ILIKE`;break}case"eq":default:{o=s?e.sql.fragment`!=`:e.sql.fragment`=`;break}case"gt":{o=s?e.sql.fragment`<`:e.sql.fragment`>`;break}case"gte":{o=s?e.sql.fragment`<`:e.sql.fragment`>=`;break}case"lte":{o=s?e.sql.fragment`>`:e.sql.fragment`<=`;break}case"lt":{o=s?e.sql.fragment`>`:e.sql.fragment`<`;break}case"in":{o=s?e.sql.fragment`NOT IN`:e.sql.fragment`IN`,i=e.sql.fragment`(${e.sql.join(i.split(","),e.sql.fragment`, `)})`;break}case"bt":{o=s?e.sql.fragment`NOT BETWEEN`:e.sql.fragment`BETWEEN`,i=e.sql.fragment`${e.sql.join(i.split(","),e.sql.fragment` AND `)}`;break}}return e.sql.fragment`${l} ${o} ${i}`},S=(a,t,r=!1)=>{const n=[],s=[];let i;const l=(o,d,q=!1)=>{if("AND"in o)for(const m of o.AND)l(m,d);else if("OR"in o)for(const m of o.OR)l(m,d,!0);else{const m=R(d,o);q?s.push(m):n.push(m)}};return l(a,t,r),n.length>0&&s.length>0?i=e.sql.join([e.sql.fragment`(${e.sql.join(n,e.sql.fragment` AND `)})`,e.sql.fragment`(${e.sql.join(s,e.sql.fragment` OR `)})`],e.sql.fragment`${"AND"in a?e.sql.fragment` AND `:e.sql.fragment` OR `}`):n.length>0?i=e.sql.join(n,e.sql.fragment` AND `):s.length>0&&(i=e.sql.join(s,e.sql.fragment` OR `)),i?e.sql.fragment`WHERE ${i}`:e.sql.fragment``},E=(a,t)=>a?S(a,t):e.sql.fragment``,N=(a,t)=>{let r=e.sql.fragment`LIMIT ${a}`;return t&&(r=e.sql.fragment`LIMIT ${a} OFFSET ${t}`),r},h=(a,t)=>{if(t&&t.length>0){const r=[];for(const n of t){const s=n.direction==="ASC"?e.sql.fragment`ASC`:e.sql.fragment`DESC`;r.push(e.sql.fragment`${e.sql.identifier([...a.names,u.decamelize(n.key)])} ${s}`)}return e.sql.fragment`ORDER BY ${e.sql.join(r,e.sql.fragment`,`)}`}return e.sql.fragment``},A=(a,t)=>e.sql.fragment`${f(a,t)}`,f=(a,t)=>e.sql.identifier(t?[t,a]:[a]),G=a=>e.sql.fragment`WHERE id = ${a}`;class O{_service;constructor(t){this._service=t}getAllSql=(t,r)=>{const n=[],s={};for(const o of t)n.push(e.sql.identifier([u.decamelize(o)])),s[u.camelize(o)]=!0;const i=f(this.table,this.schema),l=this.validationSchema._def.typeName==="ZodObject"?this.validationSchema.pick(s):_.z.any();return e.sql.type(l)`
      SELECT ${e.sql.join(n,e.sql.fragment`, `)}
      FROM ${this.getTableFragment()}
      ${h(i,this.getSortInput(r))}
    `};getCreateSql=t=>{const r=[],n=[];for(const s in t){const i=s,l=t[i];r.push(e.sql.identifier([u.decamelize(i)])),n.push(l)}return e.sql.type(this.validationSchema)`
      INSERT INTO ${this.getTableFragment()}
        (${e.sql.join(r,e.sql.fragment`, `)})
      VALUES (${e.sql.join(n,e.sql.fragment`, `)})
      RETURNING *;
    `};getCountSql=t=>{const r=f(this.table,this.schema),n=_.z.object({count:_.z.number()});return e.sql.type(n)`
      SELECT COUNT(*)
      FROM ${this.getTableFragment()}
      ${E(t,r)};
    `};getDeleteSql=t=>e.sql.type(this.validationSchema)`
      DELETE FROM ${this.getTableFragment()}
      WHERE id = ${t}
      RETURNING *;
    `;getFindByIdSql=t=>e.sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE id = ${t};
    `;getListSql=(t,r,n,s)=>{const i=f(this.table,this.schema);return e.sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${E(n,i)}
      ${h(i,this.getSortInput(s))}
      ${N(t,r)};
    `};getSortInput=t=>t||[{key:this.sortKey,direction:this.sortDirection}];getTableFragment=()=>A(this.table,this.schema);getUpdateSql=(t,r)=>{const n=[];for(const s in r){const i=r[s];n.push(e.sql.fragment`${e.sql.identifier([u.decamelize(s)])} = ${i}`)}return e.sql.type(this.validationSchema)`
      UPDATE ${this.getTableFragment()}
      SET ${e.sql.join(n,e.sql.fragment`, `)}
      WHERE id = ${t}
      RETURNING *;
    `};get config(){return this.service.config}get database(){return this.service.database}get sortDirection(){return this.service.sortDirection}get sortKey(){return this.service.sortKey}get service(){return this._service}get schema(){return this.service.schema}get table(){return this.service.table}get validationSchema(){return this.service.validationSchema}}class M{static TABLE=void 0;static LIMIT_DEFAULT=20;static LIMIT_MAX=50;static SORT_DIRECTION="ASC";static SORT_KEY="id";_config;_database;_factory;_schema="public";_validationSchema=_.z.any();constructor(t,r,n){this._config=t,this._database=r,n&&(this._schema=n)}all=async(t,r)=>{const n=this.factory.getAllSql(t,r);return await this.database.connect(i=>i.any(n))};create=async t=>{const r=this.factory.getCreateSql(t),n=await this.database.connect(async s=>s.query(r).then(i=>i.rows[0]));return n?this.postCreate(n):void 0};delete=async t=>{const r=this.factory.getDeleteSql(t);return await this.database.connect(s=>s.maybeOne(r))};findById=async t=>{const r=this.factory.getFindByIdSql(t);return await this.database.connect(s=>s.maybeOne(r))};getLimitDefault=()=>this.config.slonik?.pagination?.defaultLimit||this.constructor.LIMIT_DEFAULT;getLimitMax=()=>this.config.slonik?.pagination?.maxLimit||this.constructor.LIMIT_MAX;list=async(t,r,n,s)=>{const i=this.factory.getListSql(Math.min(t??this.getLimitDefault(),this.getLimitMax()),r,n,s),[l,o,d]=await Promise.all([this.count(),this.count(n),this.database.connect(q=>q.any(i))]);return{totalCount:l,filteredCount:o,data:d}};count=async t=>{const r=this.factory.getCountSql(t);return(await this.database.connect(s=>s.any(r)))[0].count};update=async(t,r)=>{const n=this.factory.getUpdateSql(t,r);return await this.database.connect(s=>s.query(n).then(i=>i.rows[0]))};get config(){return this._config}get database(){return this._database}get factory(){if(!this.table)throw new Error("Service table is not defined");return this._factory||(this._factory=new O(this)),this._factory}get sortDirection(){return this.constructor.SORT_DIRECTION}get sortKey(){return this.constructor.SORT_KEY}get schema(){return this._schema||"public"}get table(){return this.constructor.TABLE}get validationSchema(){return this._validationSchema||_.z.any()}postCreate=async t=>t}const B=a=>a.toISOString().slice(0,23).replace("T"," "),z=async a=>{const t=a.slonik,r="migrations";let n={database:t.db.databaseName,user:t.db.username,password:t.db.password,host:t.db.host,port:t.db.port};t.clientConfiguration?.ssl&&(n={...n,ssl:t.clientConfiguration?.ssl});const s=new F.Client(n);await s.connect(),await $.migrate({client:s},t?.migrations?.path||r),await s.end()},W=g(async(a,t,r)=>{a.log.info("Running database migrations"),await z(a.config),r()});c.BaseService=M,c.DefaultSqlFactory=O,c.applyFilter=R,c.applyFiltersToQuery=S,c.createBigintTypeParser=b,c.createDatabase=T,c.createFilterFragment=E,c.createLimitFragment=N,c.createSortFragment=h,c.createTableFragment=A,c.createTableIdentifier=f,c.createWhereIdFragment=G,c.default=j,c.formatDate=B,c.migrationPlugin=W,Object.defineProperties(c,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
