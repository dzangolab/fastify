# @dzangolab/fastify-s3

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of S3 in a fastify API.

## Requirements

* [@dzangolab/fastify-config](../config/)
* [@dzangolab/fastify-slonik](../slonik/)

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-slonik @dzangolab/fastify-s3
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-slonik @dzangolab/fastify-s3
```

## Usage

### Permission

When using AWS S3, you are required to enable the following permissions:

***Required Permission:***

- GetObject Permission
- GetObjectAttributes Permission
- PutObject Permission

***Optional Permissions:***

- ListBucket Permission
  - If you choose the `add-suffix` option for FilenameResolutionStrategy when dealing with duplicate files, then you have to enable this permission.
- DeleteObject Permission
  - If you use the `deleteFile` method from the file service, you will need this permission


***Sample S3 Permission:***

```json
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
               "Principal": "*",
              "Action": [
                  "s3:ListBucket"
              ],
              "Resource": "arn:aws:s3:::your-bucket"
          },
          {
              "Effect": "Allow",
              "Principal": "*",
              "Action": [
                  "s3:DeleteObject",
                  "s3:GetObject",
                  "s3:GetObjectAttributes",
                  "s3:PutObject"
              ],
              "Resource": "arn:aws:s3:::your-bucket/*"
          }
      ]
  }
```

### Register plugin

Register the file fastify-s3 package with your Fastify instance:

```typescript
import configPlugin from "@dzangolab/fastify-config";
import s3Plugin, { multipartParserPlugin } from "@dzangolab/fastify-s3";
import slonikPlugin from "@dzangolab/fastify-slonik";
import Fastify from "fastify";

import config from "./config";

const start = async () => {
  // Create fastify instance
  const api = Fastify({
    logger: config.logger,
  });

  // Register config plugin
  await api.register(configPlugin, { config });

  // Register database plugin
  await api.register(slonikPlugin);
  
  // Register fastify-s3 plugin
  await api.register(s3Plugin);
  
  await api.listen({
    port: config.port,
    host: "0.0.0.0",
  });
}

start();
```

### Using GraphQL

This package uses [@dzangolab/fastify-graphql](../graphql/) for graphql.

Register additional `multipartParserPlugin` plugin with the fastify instance as shown below:

```typescript
import graphqlPlugin from "@dzangolab/fastify-graphql";
import s3Plugin, { multipartParserPlugin } from "@dzangolab/fastify-s3";
import Fastify from "fastify";

import config from "./config";

const start = async () => {
  // Create fastify instance
  const api = Fastify({
    logger: config.logger,
  });
  
  // Register config plugin
  await api.register(configPlugin, { config });

  // Register multipart content-type parser plugin (required for graphql file upload or if using both graphql and rest file upload)
  await api.register(multipartParserPlugin);

  // Register graphql plugin
  await api.register(graphqlPlugin);

  // Register fastify-s3 plugin
  await api.register(s3Plugin);

  await await.listen({
    port: config.port,
    host: "0.0.0.0",
  });
}

start();
```

**Note**: Register the `multipartParserPlugin` if you're using GraphQL or both GraphQL and REST, as it's required. Make sure to place the registration of the `multipartParserPlugin` above the `graphqlPlugin`.

## Configuration

To initialize Client:

AWS S3 Config

```typescript
const config: ApiConfig = {
  // ... other configurations
  
  s3: {
    //... AWS S3 settings
    accessKey: "accessKey",   // Replace with your AWS access key
    secretKey: "secretKey",   // Replace with your AWS secret key
    bucket: "" | { key: "value" }, // Specify your S3 bucket
    region: "ap-southeast-1" // Replace with your AWS region
  }
};
```

Minio Service Config

```typescript
const config: ApiConfig = {
  // ... other configurations
  
  s3: {
    accessKey: "yourMinioAccessKey",
    secretKey: "yourMinioSecretKey",
    bucket: "yourMinioBucketName",
    endpoint: "http://your-minio-server-url:port", // Replace with your Minio server URL
    forcePathStyle: true, // Set to true if your Minio server uses path-style URLs
    region: "" // For Minio, you can leave the region empty or specify it based on your setup
  }
};

```

To Add a custom table name:

```typescript
const config: ApiConfig = {
  // ... other configurations
  
  s3: {
    //... AWS S3 settings
    table: {
        name: "new-table-name" // You can set a custom table name here (default: "files")
    }
  }
};

```

To limit the file size while uploading:

```typescript
const config: ApiConfig = {
  // ... other configurations
  
  s3: {
    //... AWS S3 settings
    fileSizeLimitInBytes: 10485760
  }
};

```

To handle duplicate filenames:

- FilenameResolutionStrategy: This option has three choices: `override`, `add-suffix`, and `error`.
  - `error`: If you choose the error option, it will throw an error if the file name is duplicated in the S3 bucket.
  - `add-suffix`: If you choose the add-suffix option, it will append `-<number>` to the file name if it is duplicated.<br>For example, if the filename is `example.png` which is already exist on S3 bucket, the new name will be `example-1.png`.
  - `override`: This is the default option and it overrides the file if the file name already exists.

  ```typescript
    fileService.upload({
      // ... other options
      options: {
        // ... other options
        filenameResolutionStrategy: "add-suffix",
      },
    });
  ```

## Context
