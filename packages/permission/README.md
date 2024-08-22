# @dzangolab/fastify-permission

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of permission system to API.

## Requirements

* [@dzangolab/fastify-config](../config/)
* [@dzangolab/fastify-slonik](../slonik/)

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-slonik @dzangolab/fastify-permission
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-slonik @dzangolab/fastify-permission
```

## Usage

### Register Plugin

Register the fastify-permission plugin and routes with your Fastify instance:

```typescript
import permissionPlugin from "@dzangolab/fastify-permission";
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

  // Register fastify-permission plugin
  await fastify.register(permissionPlugin);

  await fastify.listen({
    port: config.port,
    host: "0.0.0.0",
  });
}

start();
```
