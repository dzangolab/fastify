# @dzangolab/fastify-firebase

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of Firebase Admin in a fastify API.

## Requirements

* [@dzangolab/fastify-config](../config/)
* [@dzangolab/fastify-slonik](../slonik/)

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-slonik @dzangolab/fastify-firebase
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-slonik @dzangolab/fastify-firebase
```

## Usage

### Register Plugin

Register the fastify-firebase plugin with your Fastify instance:

```typescript
import firebasePlugin from "@dzangolab/fastify-firebase";
import configPlugin from "@dzangolab/fastify-config";
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

  // Register fastify-firebase plugin
  await fastify.register(firebasePlugin);

  await fastify.listen({
    port: config.port,
    host: "0.0.0.0",
  });
}

start();
```

## Configuration

Add firebase configuration

```typescript
const config: ApiConfig = {
  // ...
  firebase: {
    credentials: {
      clientEmail: "...",
      privateKey: "...",
      projectId: "...",
    }
    table: {
      userDevices: {
        name: "user-devices";
      }
    }
    notification: {
      test: {
        enabled: true,
        path: '/send-notification'
      }
    };
    handlers: {
      userDevice?: {
        addUserDevice: (request: SessionRequest, reply: FastifyReply) => Promise<void>
      },
      notification: {
        sendNotification: (request: SessionRequest, reply: FastifyReply) => Promise<void>
      },
    };
  }
};
```

## Using GraphQL

This package supports integration with [@dzangolab/fastify-graphql](../graphql/).

### Schema Integration

The GraphQL schema provided by this package is located at [src/graphql/schema.ts](./src/graphql/schema.ts) and is exported as `firebaseSchema`.

To load and merge this schema with your application's custom schemas, update your schema file as follows:

```typescript
import { firebaseSchema } from "@dzangolab/fastify-firebase";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "";
import { makeExecutableSchema } from "@graphql-tools/schema";

const schemas: string[] = loadFilesSync("./src/**/*.gql");

const typeDefs = mergeTypeDefs([firebaseSchema, ...schemas]);
const schema = makeExecutableSchema({ typeDefs });

export default schema;
```

### Resolver Integration

To integrate the resolvers provided by this package, import them and merge with your application's resolvers:

```typescript
import { notificationResolver, userDeviceResolver } from "@dzangolab/fastify-firebase";

import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    // ...other mutations ...
    ...userDeviceResolver.Mutation,
    ...notificationResolver.Mutation,
  },
  Query: {
    // ...other queries ...
    ...userDeviceResolver.Query,
    ...notificationResolver.Query,
  },
};

export default resolvers;
```
