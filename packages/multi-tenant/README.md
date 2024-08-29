# @dzangolab/fastify-multi-tenant

A [Fastify](https://github.com/fastify/fastify) plugin that adds support for multi-tenant architecture in your API.

## Requirements

* [@dzangolab/fastify-config](../config/)
* [@dzangolab/fastify-mailer](../mailer/)
* [@dzangolab/fastify-slonik](../slonik/)
* [@dzangolab/fastify-user](../user/)

## Tenants table

You need to create a table containing the tenants. You can name the table as you wish. The default name is `tenants`.

The table should contain the following columns:

| Purpose      | Type                              | Constraints               |  Default column name |
|--------------|-----------------------------------|---------------------------|----------------------|
| Identifier   | `integer \| varchar(255) \| uuid` | `PK`                      | `id`                 |
| Display name | varchar(255)                      | `NOT NULL`                | `name`               |
| Owner ID     | varchar(36)                       |                           | `owner_id`           |
| Slug         | varchar(63)                       | `NOT NULL UNIQUE`         | `slug`               |
| Domain       | varchar(255)                      | `UNIQUE`                  | `domain`             |
| created_at   | TIMESTAMP                         | `DEFAULT NOW() NOT NULL`  | `created_at`         |
| updated_at   | TIMESTAMP                         | `DEFAULT NOW() NOT NULL`  | `updated_at`         |

The `owner_id` column serves as a foreign key referencing the `id` column in the `users` table.

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-slonik @dzangolab/fastify-multi-tenant @dzangolab/fastify-user
```
Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-slonik @dzangolab/fastify-multi-tenant @dzangolab/fastify-user
```

## Usage

## Register the fastify plugin

Register the plugin with your Fastify instance:

```typescript
import configPlugin from "@dzangolab/fastify-config";
import mailerPlugin from "@dzangolab/fastify-mailer";
import multiTenantPlugin, {
  tenantMigrationPlugin,
  tenantRoutes
} from "@dzangolab/fastify-multi-tenant"
import slonikPlugin, { migrationPlugin } from "@dzangolab/fastify-slonik"
import userPlugin from "@dzangolab/fastify-user";
import Fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

const start = async () => {
  // Create fastify instance
  const fastify = Fastify({
    logger: config.logger,
  });
  
  // Register fastify-config plugin
  await fastify.register(configPlugin, { config });

  // Register mailer plugin
  await fastify.register(mailerPlugin);
  
  // Register database plugin
  await fastify.register(slonikPlugin);
  
  // Register multi tenant plugin
  await fastify.register(multiTenantPlugin);
  
  // Register user plugin
  await fastify.register(userPlugin);
  
  // Run app database migrations
  await fastify.register(migrationPlugin);
  
  // Run tenant database migrations
  await fastify.register(tenantMigrationPlugin);

  // Register routes provide by multi-tenant
  await fastify.register([ tenantRoutes ]);
  
  await fastify.listen({
    port: config.port,
    host: "0.0.0.0",
  });
};

start();
```

## Configuration

If you are not using the default table name and columns, add the following configuration to your `config`:

```typescript
const config: ApiConfig = {
  // ...
  multiTenant: {
    reserved: {
      slugs: ["..."],
      domains: ["..."],
    },
    rootDomain: "";
    table: {
      columns: {
        id: "...",
        domain: "...",
        name: "...",
        ownerId: "...",
        slug: "...",
      },
      name: "...",
    },
  }
};
```
## Using GraphQL

This package supports integration with [@dzangolab/fastify-graphql](../graphql/).

### Configuration

Add the required context for the fastify-user package by including `multiTenantPlugin` in your GraphQL configuration as shown below:

```typescript
import multiTenantPlugin from "@dzangolab/fastify-multi-tenant";
import userPlugin from "@dzangolab/fastify-user";
import type { ApiConfig } from "@dzangolab/fastify-config";

const config: ApiConfig = {
  // ...other configurations...
  graphql: {
    // ...other graphql configurations...
    plugins: [userPlugin, multiTenantPlugin],
  },
  // ...other configurations...
};
```

### Schema Integration
This package does not provide a predefined schema. To integrate it into your GraphQL setup, add the following to your GraphQL schema:

```graphql
type Tenant {
  id: Int!
  name: String
  slug: String!
  domain: String
  ownerId: String
  createdAt: Float!
  updatedAt: Float!
}

type Tenants {
  totalCount: Int
  filteredCount: Int
  data: [Tenant]!
}

input TenantCreateInput {
  name: String
  slug: String!
  domain: String
}

type Mutation {
  createTenant(data: TenantCreateInput): Tenant @auth
}

type Query {
  allTenants(fields: [String]): [Tenant]! @auth
  tenant(id: Int): Tenant @auth
  tenants(limit: Int, offset: Int, filters: Filters, sort: [SortInput]): Tenants! @auth
}
```

### Resolver Integration

To integrate the resolvers provided by this package, import them and merge with your application's resolvers:

```typescript
import { tenantResolver } from "@dzangolab/fastify-multi-tenant";

import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    // ...other mutations ...
    ...tenantResolver.Mutation,
  },
  Query: {
    // ...other queries ...
    ...tenantResolver.Query,
  },
};

export default resolvers;
```
