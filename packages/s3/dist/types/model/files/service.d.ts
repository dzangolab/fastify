/// <reference types="node" />
import { BaseService } from "@dzangolab/fastify-slonik";
import { PresignedUrlOptions, FilePayload } from "../../types/";
import S3Client from "../../utils/s3Client";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";
declare class FileService<File extends QueryResultRow, FileCreateInput extends QueryResultRow, FileUpdateInput extends QueryResultRow> extends BaseService<File, FileCreateInput, FileUpdateInput> implements Service<File, FileCreateInput, FileUpdateInput> {
    protected _filename: string;
    protected _fileExtension: string;
    protected _path: string;
    protected _s3Client: S3Client | undefined;
    get table(): string;
    get filename(): string;
    set filename(filename: string);
    get fileExtension(): string;
    set fileExtension(fileExtension: string);
    get path(): string;
    set path(path: string);
    get key(): string;
    get s3Client(): S3Client;
    deleteFile: (fileId: number, options?: {
        bucket?: string;
    }) => Promise<File | null>;
    download: (id: number, options?: {
        bucket?: string;
    }) => Promise<File & {
        mimeType: string | undefined;
        fileStream: Buffer;
    }>;
    presignedUrl: (id: number, options: PresignedUrlOptions) => Promise<File & {
        url: string | undefined;
    }>;
    upload: (data: FilePayload) => Promise<File | undefined>;
}
export default FileService;
//# sourceMappingURL=service.d.ts.map