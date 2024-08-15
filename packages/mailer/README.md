# @dzangolab/fastify-mailer

A [Fastify](https://github.com/fastify/fastify) plugin that when registered on a Fastify instance, will decorate it with a `mailer` object for email.

## Requirements

- @dzangolab/fastify-config
- html-minifier
- html-to-text
- mustache
- nodemailer
- nodemailer-html-to-text
- nodemailer-mjml

## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-mailer
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-mailer
```

## Usage

### Register Plugin
Register @dzangolab/fastify-mailer package with your Fastify instance:
```typescript
import configPlugin from "@dzangolab/fastify-config";
import mailerPlugin from "@dzangolab/fastify-mailer";
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

// Register mailer plugin
await api.register(mailerPlugin)

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
});
```

## Configuration
Add mailer configuration:
```typescript
const config: ApiConfig = {
  // ...
  mailer: {
    defaults: {
      from: {
        address: "test@example.com",
        name: "Test",
      },
    },
    test: {
      enabled: true
      path: "/test/email",
      to: "user@example.com"),
    },
    templating: {
      templateFolder: "mjml/templates",
    },
    templateData: {
      baseCDNUrl: "http://localhost:3000/"),
    },
    transport: {
      auth: {
        pass: "pass",
        user: "user",
      },
      host: "localhost",
      port: 3001,
      requireTLS: true,
      secure: true,
    },
  },
};
```
