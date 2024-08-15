# @dzangolab/fastify-user

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of user model (service, controller, resolver) in a fastify API.

## Requirements

* [@dzangolab/fastify-config](../config/)
* [@dzangolab/fastify-slonik](../slonik/)
* [slonik](https://github.com/spa5k/fastify-slonik)
* [supertokens-node](https://github.com/supertokens/supertokens-node)

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-slonik slonik @dzangolab/fastify-user
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-slonik slonik @dzangolab/fastify-user
```

## Usage

Register the user plugin with your Fastify instance:

```typescript
import configPlugin from "@dzangolab/fastify-config";
import slonikPlugin, { migrationPlugin } from "@dzangolab/fastify-slonik";
import userPlugin {
  invitationRoutes,
  permissionRoutes,
  roleRoutes,
  userRoutes,
} from "@dzangolab/fastify-user";
import fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

const start = async () => {
  // Create fastify instance
  const fastify = Fastify({
    logger: config.logger,
  });

  // Register database plugin
  await api.register(slonikPlugin);
  
  // Register fastify-config plugin
  await fastify.register(configPlugin, { config });
  
  // Register fastify-user plugin
  await fastify.register(userPlugin);

  // Register routes provide by user plugin
  await fastify.register([
    invitationRoutes,
    permissionRoutes,
    roleRoutes,
    userRoutes,
  ]);
  
  // Run app database migrations
  await api.register(migrationPlugin);
  
  await fastify.listen({
    port: config.port,
    host: "0.0.0.0",
  });
};

start();
```

### Using graphql

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

Add resolver in your apps resolver collection

```typescript
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
