declare module "fastify" {
    interface FastifyRequest {
        graphqlFileUploadMultipart?: boolean;
    }
}
declare const _default: import("fastify").FastifyPluginCallback<Record<string, never>, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
export default _default;
//# sourceMappingURL=multipartParser.d.ts.map