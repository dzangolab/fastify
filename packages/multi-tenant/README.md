# @dzangolab/fastify-multi-tenant

A [Fastify](https://github.com/fastify/fastify) plugin that adds support for multi-tenant architecture in your API.

## Requirements

* `@dzangolab/fastify-config`
* `@dzangolab/fastify-mailer`
* `@dzangolab/fastify-mercurius`
* `@dzangolab/fastify-slonik`
* `@dzangolab/fastify-user`

## Tenants table

You need to create a table containing the tenants. You can name the table as you wish. The default name is `tenants`.

The table should contain the following columns:

| Purpose      | Type                              | Constraints               |  Default column name |
|--------------|-----------------------------------|---------------------------|----------------------|
| Identifier   | `integer \| varchar(255) \| uuid` | `PK`                      | `id`                 |
| Display name | varchar(255)                      | `NOT NULL`                | `name`               |
| Slug         | varchar(63)                       | `NOT NULL UNIQUE`         | `slug`               |
| Domain       | varchar(255)                      | `UNIQUE`                  | `domain`             |
| created_at   | TIMESTAMP                         | `DEFAULT NOW() NOT NULL`  | `created_at`         |
| updated_at   | TIMESTAMP                         | `DEFAULT NOW() NOT NULL`  | `updated_at`         |

## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-mercurius @dzangolab/fastify-slonik @dzangolab/fastify-multi-tenant @dzangolab/fastify-user
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-mercurius @dzangolab/fastify-slonik @dzangolab/fastify-multi-tenant @dzangolab/fastify-user
```

## Usage

## Register the fastify plugin

Register the plugin with your Fastify instance:

```typescript
import configPlugin from "@dzangolab/fastify-config";
import multiTenantPlugin, {
  tenantMigrationPlugin,
} from "@dzangolab/fastify-multi-tenant"
import slonikPlugin, { migrationPlugin } from "@dzangolab/fastify-slonik"
import fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

// Create fastify instance
const fastify = Fastify({
  logger: config.logger,
});

// Register fastify-config plugin
await fastify.register(configPlugin, { config });

// Register mailer plugin
await api.register(mailerPlugin);

// Register database plugin
await api.register(slonikPlugin);

// Register multi tenant plugin
await api.register(multiTenantPlugin);

// Register mercurius plugin
await api.register(mercuriusPlugin);

// Register user plugin
await api.register(userPlugin);

// Run app database migrations
await api.register(migrationPlugin);

// Run tenant database migrations
await api.register(tenantMigrationPlugin);


await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
 });
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
        slug: "...",
      },
      name: "...",
    },
  }
};
```
