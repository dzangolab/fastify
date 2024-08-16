# @dzangolab/fastify-user

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of user model (service, controller, resolver) in a fastify API.

## Requirements

* [@dzangolab/fastify-config](../config/)
* [@dzangolab/fastify-mailer](../mailer/)
* [@dzangolab/fastify-slonik](../slonik/)
* [slonik](https://github.com/spa5k/fastify-slonik)
* [supertokens-node](https://github.com/supertokens/supertokens-node)

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-slonik @dzangolab/fastify-user slonik supertokens-node
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-slonik @dzangolab/fastify-user slonik supertokens-node
```

## Usage

Register the user plugin and routes with your Fastify instance:

```typescript
import configPlugin from "@dzangolab/fastify-config";
import mailerPlugin from "@dzangolab/fastify-mailer";
import slonikPlugin, { migrationPlugin } from "@dzangolab/fastify-slonik";
import userPlugin {
  invitationRoutes,
  permissionRoutes,
  roleRoutes,
  userRoutes,
} from "@dzangolab/fastify-user";
import Fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

const start = async () => {
  // Create fastify instance
  const api = Fastify({
    logger: config.logger,
  });

  // Register database plugin
  await api.register(slonikPlugin);

  // Register mailer plugin
  await api.register(mailerPlugin);
  
  // Register fastify-config plugin
  await api.register(configPlugin, { config });
  
  // Register fastify-user plugin
  await api.register(userPlugin);

  // Register routes provide by user plugin
  await api.register([
    invitationRoutes,
    permissionRoutes,
    roleRoutes,
    userRoutes,
  ]);
  
  // Run app database migrations
  await api.register(migrationPlugin);
  
  await api.listen({
    port: config.port,
    host: "0.0.0.0",
  });
};

start();
```

### Using GraphQL

This package support [@dzangolab/fastify-graphql](../graphql/) for GraphQL. Additionally, install [mercurius-auth](https://github.com/mercurius-js/auth)

The schema provided by this package is located at [src/graphql/schema.ts](./src/graphql/schema.ts) and is exported under the name `userSchema`.

Add resolver in your apps resolver collection:

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
