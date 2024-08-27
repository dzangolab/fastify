import { UploadOptions } from "graphql-upload-minimal";
import type { FastifyPluginCallback } from "fastify";
declare module "fastify" {
    interface FastifyRequest {
        graphqlFileUploadMultipart?: boolean;
    }
}
export declare const mercuriusUpload: FastifyPluginCallback<UploadOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
export default mercuriusUpload;
//# sourceMappingURL=graphqlUpload.d.ts.map