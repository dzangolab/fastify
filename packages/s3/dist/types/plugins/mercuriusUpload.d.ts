import { UploadOptions } from "graphql-upload-minimal";
import type { FastifyPluginCallback } from "fastify";
declare module "fastify" {
    interface FastifyRequest {
        mercuriusUploadMultipart?: boolean;
    }
}
export declare const mercuriusUpload: FastifyPluginCallback<UploadOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
export default mercuriusUpload;
//# sourceMappingURL=mercuriusUpload.d.ts.map