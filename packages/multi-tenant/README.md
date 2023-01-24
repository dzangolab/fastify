# @dzangolab/fastify-nulti-tenant

A [Fastify](https://github.com/fastify/fastify) plugin that adds support for multi-tenant architecture in your API.

When registered on a Fastify instance, the plugin will:
* run migrations for each tenant

## Requirements

* `@dzangolab/fastify-config`
* `@dzangolab/fastify-slonik`

## Tenants table

You need to create a table containing the tenants. You can name the table as you wish. The default name is `tenants`.

The table should contain the following columns:

| Purpose      | Type                              | Constraints               |  Default column name |
|--------------|-----------------------------------|---------------------------|----------------------|
| Identifier   | `integer \| varchar(255) \| uuid` | `PK`                      | `id`                 |
| Display name | varchar(255)                      | `NOT NULL`                | `name`               |
| Slug         | varchar(63)                       | `NOT NULL`                | `slug`               |
| Domain       | varchar(255)                      | `UNIQUE`                  | `domain`             |
| created_at   | TIMESTAMP                         | `DEFAULT NOW() NOT NULL`  | `created_at`         |
| updated_at   | TIMESTAMP                         | `DEFAULT NOW() NOT NULL`  | `updated_at`         |

## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-multi-tenant
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-config @dzangolab/fastify-multi-tenant
```

## Usage

## Register the fastify plugin

Register the plugin with your Fastify instance:

```javascript
import configPlugin from "@dzangolab/fastify-config";
import multiTenantPlugin from "@dzangolab/fastify-multi-tenant";
import fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

// Create fastify instance
const fastify = Fastify({
  logger: config.logger,
});

// Register fastify-config plugin
fastify.register(configPlugin, { config });

fastify.register(multiTenantPlugin, { config });

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
 });
```

## Configuration

If you are not using the default table name and columns, add the following configuration to your `config`:

```
const config: ApiConfig = {
  // ...
  multiTenant: {
    table: {
      columns: {
        id: "...",
        domain: "...",
        name: "...",
        slug: "...",
      },
      name: "...",
    }
  }
};
```
