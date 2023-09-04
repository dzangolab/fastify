# @dzangolab/fastify-s3

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of S3 in a fastify API.

## Requirements

- @dzangolab/fastify-config
- @dzangolab/fastify-slonik

## Installation

In a simple repo:

```bash
npm install @dzangolab/fastify-s3
```

If using in a monorepo with pnpm:

```bash
pnpm add --filter "myrepo" @dzangolab/fastify-s3
```

## Usage

Register the file fastify-s3 package with your Fastify instance:

```javascript
import s3Plugin from "@dzangolab/fastify-s3";
import fastify from "fastify";

import config from "./config";

// Create fastify instance
const fastify = Fastify({
  logger: config.logger,
});

// Register fastify-s3 plugin
fastify.register(s3Plugin);

await fastify.listen({
  port: config.port,
  host: "0.0.0.0",
});
```

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
    bucket: "" | { key: "value" } // Specify your S3 bucket or use the default value
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
    fileSizeLimit: 160000 // Specify the maximum file size in bytes here
  }
};

```

## Context
