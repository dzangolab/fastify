# @dzangolab/fastify-firebase

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of Firebase Admin in a fastify API.

## Requirements

- @dzangolab/fastify-config
- @dzangolab/fastify-slonik
- @dzangolab/fastify-mercurius

## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-firebase
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-firebase
```

## Usage

### Register Plugin
Register the file fastify-firebase package with your Fastify instance:
```javascript
import firebasePlugin, { initializeFirebase } from "@dzangolab/fastify-firebase";
import configPlugin from "@dzangolab/fastify-config";
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

// Register fastify-user route
fastify.register(firebasePlugin);

// Initialize firebase admin
initializeFirebase(config);

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
});
```

Add resolver in your apps resolver collection

```javascript
import { userDeviceResolver } from "@dzangolab/fastify-firebase";

import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    ...userDeviceResolver.Mutation,
  },
  Query: {
    ...userDeviceResolver.Query,
  },
};

export default resolvers;
```

## Configuration
Add firebase configuration
```typescript
const config: ApiConfig = {
  // ...
  firebase: {
    clientEmail: "...",
    privateKey: "...",
    projectId: "...",
    table: {
      userDevices: {
        name: "user-devices";
      };
    }
  }
};
```
