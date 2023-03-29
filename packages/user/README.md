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

## Configuration
To add custom email and password validations:
```typescript
const config: ApiConfig = {
  // ...
  user: {
    //...
    email: {
      host_whitelist: ["..."]
    },
    password: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    }
  }
};
```
`UserProfile` only has `id` as field. To include other fields like `givenName`, `surname`, etc. we have to augment the type `UserProfile`.

eg:
```typescript
declare module "@dzangolab/fastify-user" {
  interface UserProfile {
    givenName: string;
    surname?: string;
  }
}
```
Some IDE may throw error on `@dzangolab/fastify-user` pointing out the module could'nt be found. To resolve it, we can add an import statement:
```typescript
import { UserProfile } from "@dzangolab/fastify-user";
```

## Context
