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
import { usersResolver, userProfileResolver } from "@dzangolab/fastify-user";

import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    ...usersResolver.Mutation,
  },
  Query: {
    ...users.Query,
    ...userProfileResolver.Query,
  },
};

export default resolvers;
```

Example schema for the package

```javascript
import { gql } from "mercurius-codegen";

const schema = gql`
  directive @auth on OBJECT | FIELD_DEFINITION

  input Filters {
    AND: [Filters]
    OR: [Filters]
    not: Boolean
    key: String
    operator: String
    value: String
  }

  enum SortDirection {
    ASC
    DESC
  }

  input SortInput {
    key: String
    direction: SortDirection
  }

  type Query {
    user(id: String): User @auth
    users(limit: Int, offset: Int): [User]! @auth
  }

  type User {
    givenName: String
    id: String
    middleNames: String
    surname: String
  }
`;
```

To add custom password validation, update api config:
```javascript
config.user.supertokens.validatorOptions = {
  password: {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }
}
```
Above example is the default password validation.

To add email validation, update api config:
```javascript
config.user.supertokens.validatorOptions = {
  email: {
    host_whitelist: ["example.com"]
  }
}
```
User of `SUPPORTED_EMAIL_DOMAINS` environment variable is deprecated.

## Configuration

## Context
