import s3Client from "./s3Client";

import type { ApiConfig } from "@dzangolab/fastify-config";

class envS3Client extends s3Client {
  constructor(config: ApiConfig) {
    super(config);
  }
}

export default envS3Client;
