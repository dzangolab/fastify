# @dzangolab/fastify
A set of fastify libraries


## Packages
  - @dzangolab/fastify-config (https://www.npmjs.com/package/@dzangolab/fastify-config)
  - @dzangolab/fastify-mailer (https://www.npmjs.com/package/@dzangolab/fastify-mailer)
  - @dzangolab/fastify-mercurius (https://www.npmjs.com/package/@dzangolab/fastify-mercurius)
  - @dzangolab/fastify-multi-tenant (https://www.npmjs.com/package/@dzangolab/fastify-multi-tenant)
  - @dzangolab/fastify-s3 (https://www.npmjs.com/package/@dzangolab/fastify-s3)
  - @dzangolab/fastify-slonik (https://www.npmjs.com/package/@dzangolab/fastify-slonik)
  - @dzangolab/fastify-user (https://www.npmjs.com/package/@dzangolab/fastify-user)


## Tools
  - `eslint-config-custom` This is a utility package containing the common eslint configuration to be shared across all the libraries within the monorepo.
  - `tsconfig` This is a utility package containing all the `tsconfig.json` configuration to be shared across all the libraries within the monorepo.

# Installation & Usage
## Install dependencies
Install dependencies recursively with this command
```
make install
```

## Build all packages
```
make build
```

## Lint code
```
make lint
```

## Typecheck code
```
make typecheck
```

## Test
```
make test
```

# Developing locally & testing
The best way to verify the changes done to the libraries is to test them locally before releasing them. To test libraries locally link each libraries to the `fastify-api` using `pnpm link` command. [More on pnpm link](https://pnpm.io/cli/link).

To link and unlink the library locally run these commands from the `fastify-api` where you are linking the library:
```
pnpm link ./<path_to_libraries_monorepo>/packages/<library_name>
```

To unlink the linked library
```
pnpm unlink ./<path_to_libraries_monorepo>/packages/<library_name>
```

## Troubleshooting
  - Make sure that `package.json` and `pnpm-lock.yml` are synchronized.
  - You may need to restart your fastify api before link and unlink to see the changes.
  - All the libraries that defines or uses context has to be linked in order to link one libraries that use the context or defines it.
