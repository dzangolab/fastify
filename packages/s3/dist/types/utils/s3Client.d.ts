/// <reference types="node" />
/// <reference types="node" />
import { ReadStream } from "node:fs";
import { S3Client } from "@aws-sdk/client-s3";
import type { AbortMultipartUploadCommandOutput, CompleteMultipartUploadCommandOutput, DeleteObjectCommandOutput, ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import type { ApiConfig } from "@dzangolab/fastify-config";
declare class s3Client {
    protected _bucket: string;
    protected _config: ApiConfig;
    protected _storageClient: S3Client;
    constructor(config: ApiConfig);
    get config(): ApiConfig;
    get bucket(): string;
    set bucket(bucket: string);
    /**
     * Deletes an object from the Amazon S3 bucket.
     * @param {string} filePath - The path of the object to delete in the S3 bucket.
     * @returns {Promise<DeleteObjectCommandOutput>} A promise that resolves when the object is successfully deleted.
     */
    delete(filePath: string): Promise<DeleteObjectCommandOutput>;
    /**
     * Generates a presigned URL for downloading a file from the specified S3 bucket.
     *
     * @param {string} filePath - The path or key of the file in the bucket.
     * @param {string} originalFileName - The name to be used when downloading the file.
     * @param {number} signedUrlExpiresInSecond - (Optional) The expiration time of the presigned URL in seconds (default: 3600 seconds).
     * @returns {Promise<string | undefined>} A Promise that resolves with the generated presigned URL or undefined if an error occurs.
     */
    generatePresignedUrl(filePath: string, originalFileName: string, signedUrlExpiresInSecond?: number): Promise<string | undefined>;
    /**
     * Retrieves a file from the specified S3 bucket.
     *
     * @param {string} filePath - The path or key of the file to retrieve from the bucket.
     * @returns {Promise<{ ContentType: string, Body: Buffer }>} A Promise that resolves with the retrieved file's content type and content as a Buffer.
     */
    get(filePath: string): Promise<{
        ContentType: string | undefined;
        Body: Buffer;
    }>;
    /**
     * Uploads a file to the specified S3 bucket.
     *
     * @param {Buffer} fileStream - The file content as a Buffer.
     * @param {string} key - The key (file name) to use when storing the file in the bucket.
     * @param {string} mimetype - The MIME type of the file.
     * @returns {Promise<PutObjectCommandOutput>} A Promise that resolves with information about the uploaded object.
     */
    upload(fileStream: Buffer | ReadStream, key: string, mimetype: string): Promise<AbortMultipartUploadCommandOutput | CompleteMultipartUploadCommandOutput>;
    /**
     * Checks if a file with the given key exists in the S3 bucket.
     * @param key - The key (combination of path & file name) to check for in the bucket.
     * @returns Promise<boolean> - True if the file exists; otherwise, false.
     */
    isFileExists(key: string): Promise<boolean>;
    /**
     * Retrieves a list of objects from the S3 bucket with a specified prefix.
     *
     * @param {string} baseName - The prefix used to filter objects within the S3 bucket.
     * @returns {Promise<ListObjectsCommandOutput>} A Promise that resolves to the result of the list operation.
     */
    getObjects(baseName: string): Promise<ListObjectsCommandOutput>;
    protected init(): S3Client;
}
export default s3Client;
//# sourceMappingURL=s3Client.d.ts.map