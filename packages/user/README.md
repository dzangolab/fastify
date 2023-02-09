# @dzangolab/fastify-user

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of user model (service, controller, resolver) in a fastify API.

## Requirements

- @dzangolab/fastify-config
- @dzangolab/fastify-slonik
- @dzangolab/fastify-mercurus
- slonik
- mercurius
- supertokens-node

## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-user
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-user
```

## Usage

Register the user route with your Fastify instance:

```javascript
import configPlugin from "@dzangolab/fastify-config";
import userRoute from "@dzangolab/fastify-user";
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
fastify.register(userRoute);

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
});
```

Add resolver in your apps resolver collection

```javascript
import { userProfileResolver } from "@dzangolab/fastify-user";

import things from "../model/things/resolver";

import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    ...things.Mutation,
  },
  Query: {
    ...things.Query,
    ...userProfileResolver.Query,
  },
};

export default resolvers;
```

## Configuration

## Context
