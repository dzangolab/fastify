# @dzangolab/fastify-graphql

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of mercurius graphql server in a fastify API.

The plugin is a thin wrapper around the [mercurius](https://mercurius.dev/#/) plugin.

## Requirements

* [@dzangolab/fastify-config](../config/)
* [@dzangolab/fastify-slonik](../slonik/)
* [graphql](https://github.com/graphql/graphql-js)
* [mercurius](https://mercurius.dev/#/)
* [mercurius-codegen](https://github.com/mercurius-js/mercurius-typescript)

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-graphql graphql mercurius mercurius-codegen
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-graphql graphql mercurius mercurius-codegen
```

## Usage
To set up graphql in fastify project, follow these steps:

Create a resolvers file at `src/graphql/resolvers.ts` to define all GraphQL mutations and queries.

```typescript
import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    subtract: async (_, { x, y }) => x - y,
  },
  Query: {
    add: async (_, { x, y }) => x + y,
  },
};

export default resolvers;
```

Create a schema file at `src/graphql/schema.ts`:

```typescript
const schema = `
  type Mutation {
    subtract(x: Int, y: Int): Int
  }

  type Query {
    add(x: Int, y: Int): Int
  }
`;

export default schema;
```

Export the resolvers and schema from the `src/graphql/index.ts` file:

```typescript
export { default as resolvers } from "./resolvers";
export { default as schema } from "./schema";
```

Add a `graphql` block to your config in `config/index.ts`:

```typescript
import { parse } from "@dzangolab/fastify-config";
import dotenv from "dotenv";

import { resolvers, schema } from "../src/graphql";

import type { ApiConfig } from "@dzangolab/fastify-config";

dotenv.config();

const config: ApiConfig = {
  // ...other configurations...
  graphql: {
    enabled: true,
    graphiql: false,
    path: "/graphql",
    resolvers,
    schema,
  },
  // ...other configurations...
};

export default config;
```

Register the plugin with your fastify instance in `src/index.ts`:

```typescript
import configPlugin from "@dzangolab/fastify-config";
import graphqlPlugin from "@dzangolab/fastify-graphql";
import Fastify from "fastify";

import config from "../config";

const start = async () => {
  const fastify = await Fastify({
    logger: config.logger,
  });

  // Register fastify-config plugin
  await fastify.register(configPlugin, { config });

  // Register fastify-graphql plugin
  await fastify.register(graphqlPlugin);

  try {
    await fastify.listen({
      port: config.port,
      host: "0.0.0.0",
    });
  } catch (error) {
    fastify.log.error(error);
  }
};

start();

```

## Configuration

The `graphql` block in the `ApiConfig` supports all of the [original mercurius plugin's options](https://mercurius.dev/#/docs/api/options?id=plugin-options).

An additional `enabled` (boolean) option allows you to disable the graphql server.

## Context

The fastify-graphql plugin will generate a graphql context on every request that will include the following attributes:

| Attribute  | Type | Description |
|------------|------|-------------|
| `config`   | `ApiConfig` | The fastify servers' config (as per [@dzangolab/fastify-config](../config/)) |
| `database` | `Database`  | The fastify server's slonik instance (as per [@dzangolab/fastify-slonik](../slonik/)) |
| `dbSchema` | `string` | The database schema (as per [@dzangolab/fastify-slonik](../slonik/)) |

## Supporting `.gql` files and external schema exports
 To work with multiple schemas defined in .gql files or support GraphQL schema exports from external packages (e.g., @dzangolab/fastify/user), ensure the following packages are installed in your API:

* [@graphql-tools/load](https://github.com/ardatan/graphql-tools/tree/master/packages/load)
* [@graphql-tools/load-files](https://github.com/ardatan/graphql-tools/tree/master/packages/load-files)
* [@graphql-tools/merge](https://github.com/ardatan/graphql-tools/tree/master/packages/merge)
* [@graphql-tools/schema](https://github.com/ardatan/graphql-tools/tree/master/packages/schema)

To load and merge your GraphQL schemas, update your `src/graphql/schema.ts` file as follows:

```typescript
import { graphqlSchema } from "@package/schemas"; // example: importing schemas from external packages
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

const schemaFiles: string[] = loadFilesSync("./src/**/*.gql");

const typeDefs = mergeTypeDefs([graphqlSchema, ...schemaFiles]);
const schema = makeExecutableSchema({ typeDefs });

export default schema;

```
You can define additional schema types in a .gql file. For example, create a new file at `src/graphql/schema.gql`:

```graphql
type Mutation {
  subtract(x: Int, y: Int): Int
}

type Query {
  add(x: Int, y: Int): Int
}

```