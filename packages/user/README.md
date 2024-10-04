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

Register the user plugin with your Fastify instance:

```typescript
import configPlugin from "@dzangolab/fastify-config";
import mailerPlugin from "@dzangolab/fastify-mailer";
import slonikPlugin, { migrationPlugin } from "@dzangolab/fastify-slonik";
import userPlugin from "@dzangolab/fastify-user";
import Fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { FastifyInstance } from "fastify";

const start = async () => {
  // Create fastify instance
  const fastify = Fastify({
    logger: config.logger,
  });

  // Register database plugin
  await fastify.register(slonikPlugin);

  // Register mailer plugin
  await fastify.register(mailerPlugin);
  
  // Register fastify-config plugin
  await fastify.register(configPlugin, { config });
  
  // Register fastify-user plugin
  await fastify.register(userPlugin);

  // Run app database migrations
  await fastify.register(migrationPlugin);
  
  await fastify.listen({
    port: config.port,
    host: "0.0.0.0",
  });
};

start();
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

## Using GraphQL

This package supports integration with [@dzangolab/fastify-graphql](../graphql/). Additionally, you will need to install [mercurius-auth](https://github.com/mercurius-js/auth) for authentication.

### Configuration

Add the required context for the fastify-user package by including `userPlugin` in your GraphQL configuration as shown below:

```typescript
import userPlugin from "@dzangolab/fastify-user";
import type { ApiConfig } from "@dzangolab/fastify-config";

const config: ApiConfig = {
  // ...other configurations...
  graphql: {
    // ...other graphql configurations...
    plugins: [userPlugin],
  },
  // ...other configurations...
};
```

### Schema Integration

The GraphQL schema provided by this package is located at [src/graphql/schema.ts](./src/graphql/schema.ts) and is exported as `userSchema`.

To load and merge this schema with your application's custom schemas, update your schema file as follows:

```typescript
import { userSchema } from "@dzangolab/fastify-user";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

const schemas: string[] = loadFilesSync("./src/**/*.gql");

const typeDefs = mergeTypeDefs([userSchema, ...schemas]);
const schema = makeExecutableSchema({ typeDefs });

export default schema;
```

### Resolver Integration

To integrate the resolvers provided by this package, import them and merge with your application's resolvers:

```typescript
import { usersResolver } from "@dzangolab/fastify-user";

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
