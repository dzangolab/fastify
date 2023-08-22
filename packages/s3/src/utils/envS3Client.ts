import s3Client from "./s3Client";

import type { ApiConfig } from "@dzangolab/fastify-config";

class envS3Client extends s3Client {
  constructor(config: ApiConfig) {
    super(config);

    if (this.config.s3.s3Bucket) {
      this.bucket = this.config.s3.s3Bucket;
    }
  }
}

export default envS3Client;
