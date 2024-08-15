# @dzangolab/fastify-user

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of user model (service, controller, resolver) in a fastify API.

## Requirements

- @dzangolab/fastify-config
- @dzangolab/fastify-graphql
- @dzangolab/fastify-slonik
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
import { usersResolver, userRoutes } from "@dzangolab/fastify-user";

import type { IResolvers } from "mercurius";

const resolvers: IResolvers = {
  Mutation: {
    ...usersResolver.Mutation,
  },
  Query: {
    ...userResolver.Query,
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

To overwrite ThirdPartyEmailPassword recipes from config:
```typescript
const config: ApiConfig = {
  // ...
  user: {
    //...
    recipes: {
      thirdPartyEmailPassword: {
        override: {
          apis: {
            appleRedirectHandlerPOST,
            authorisationUrlGET,
            emailPasswordEmailExistsGET,
            emailPasswordSignInPOST,
            emailPasswordSignUpPOST,
            generatePasswordResetTokenPOST,
            passwordResetPOST,
            thirdPartySignInUpPOST,
          },
          functions: {
            createResetPasswordToken,
            emailPasswordSignIn,
            emailPasswordSignUp,
            getUserById,
            getUserByThirdPartyInfo,
            getUsersByEmail,
            resetPasswordUsingToken,
            thirdPartySignInUp,
            updateEmailOrPassword,
          },
        sendEmail,
        signUpFeature: {
          formFields: [
            {
              id: "password",
              validate: async (password) => {
                // if password invalid return invalid message
              },
            },
            //...
          ],
        },
      },
    },
  },
};
```
**_NOTE:_** Each above overridden elements is a wrapper function. For example to override `emailPasswordSignUpPOST` see [emailPasswordSignUpPOST](src/supertokens/recipes/config/third-party-email-password/emailPasswordSignUpPost.ts).

## Context
