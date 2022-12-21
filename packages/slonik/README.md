# @dzangolab/fastify-slonik

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of slonik  in a fastify API.

The plugin is a thin wrapper around the [`fastify-slonik`](https://github.com/spa5k/fastify-slonik) plugin.

The plugin also includes logic to run migrations via [`postgres-migrations`](https://github.com/thomwright/postgres-migrations#readme).

# Requirements

* @dzangolab/fastify-config
* slonik


## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-slonik slonik
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-slonik slonik
```

## Usage

Add a `slonik` block to your config:

```javascript
import { parse } from "@dzangolab/fastify-config";
import dotenv from "dotenv";

import type { ApiConfig } from "@dzangolab/fastify-config";

dotenv.config();

const config: ApiConfig = {
  ...
  slonik: {
    db: {
      databaseName: process.env.DB_NAME as string,
      host: process.env.DB_HOST as string,
      password: process.env.DB_PASSWORD as string,
      port: parse(process.env.DB_PORT, 5432) as number,
      username: process.env.DB_USER as string,
    },
    migrations: {
      development: parse(
        process.env.MIGRATIONS_DEVELOPMENT_FOLDER,
        "migrations"
      ) as string,
      production: parse(
        process.env.MIGRATIONS_PRODUCTION_FOLDER,
        "apps/api/build/migrations"
      ) as string,
    },
  },
  ...
};

export default config;
```

Register the plugin with your Fastify instance:

```javascript
import configPlugin from "@dzangolab/fastify-config";
import slonikPlugin from "@dzangolab/fastify-slonik";
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

// Register fastify-slonik plugin
fastify.register(slonikPlugin);

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
 });
```

## Configuration

### `db`


| Attribute  | Type | Description |
|------------|------|-------------|
| `database` | `string` | The name of the database to connect to. |
| `host`     | `string` | The database's host. |
| `password` | `string` | The password for connectingto the database. |
| `port`     | `number` | The database's port. |
| `username` | `string` | The username for connecting to the database. |

### `migrations`

Paths to the migrations files. You can specify 1 path per environment. Currently the only environments supported are: `development` and`production`.

The path must be relative to node.js `process.cwd()`.
