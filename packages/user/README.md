# @dzangolab/fastify-user

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of user model (service, controller, resolver) in a fastify API.

## Requirements

* @dzangolab/fastify-config
* @dzangolab/fastify-slonik
* @dzangolab/fastify-mercurus
* slonik
* mercurius
* supertokens-node

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

Register the plugin with your Fastify instance:

```javascript
import configPlugin from "@dzangolab/fastify-config";
import userPlugin from "@dzangolab/fastify-user";
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

// Register fastify-mercurius plugin
fastify.register(userPlugin);

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
 });
```

## Configuration

## Context
