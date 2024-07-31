# @dzangolab/fastify-graphql

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of mercurius graphql server in a fastify API.

The plugin is a thin wrapper around the [mercurius](https://mercurius.dev/#/) plugin.

## Requirements

* @dzangolab/fastify-config
* @dzangolab/fastify-slonik
* graphql
* [mercurius](https://mercurius.dev/#/)
* mercurius-codegen
* slonik

## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-graphql graphql mercurius mercurius-codegen
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-graphql graphql mercurius mercurius-codegen
```

## Usage

Add a `graphql` block to your config:

```javascript
import { parse } from "@dzangolab/fastify-config";
import dotenv from "dotenv";

import { resolvers, schema } from "path/to/graphql";

import type { ApiConfig } from "@dzangolab/fastify-config";

dotenv.config();

const config: ApiConfig = {
  ...
  graphql: {
    enabled: parse(process.env.GRAPHQL_ENABLED, true) as boolean,
    graphiql: parse(process.env.GRAPHIQL_ENABLED, false) as boolean,
    path: parse(process.env.GRAPHQL_PATH, "/graphql") as string,
    resolvers,
    schema,
  },
  ...
};

export default config;
```

Register the plugin with your Fastify instance:

```javascript
import configPlugin from "@dzangolab/fastify-config";
import graphqlPlugin from "@dzangolab/fastify-graphql";
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

// Register fastify-graphql plugin
fastify.register(graphqlPlugin);

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
 });
```

## Configuration

The `graphql` block in the `ApiConfig` supports all of the [original mercurius plugin's options](https://mercurius.dev/#/docs/api/options?id=plugin-options).

An additional `enabled` (boolean) option allows you to disable the graphql server.

## Context

The fastify-graphql plugin will generate a graphql context on every request that will include the following attributes:

| Attribute  | Type | Description |
|------------|------|-------------|
| `config`   | `ApiConfig` | The fastify servers' config (as per @dzangolab/fastify-config) |
| `database` | `Database`  | The fastify server's slonik instance (as per @dzangolab/fastify-slonik) |
| `sql`      | `SqlTaggedTemplate` | The fastify server's `sql` tagged template from slonik |
