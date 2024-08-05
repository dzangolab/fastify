/// <reference types="node" />
import { IncomingMessage } from "node:http";
import { Readable } from "node:stream";
import { ListObjectsOutput } from "@aws-sdk/client-s3";
import { FastifyRequest } from "fastify";
import type { BucketChoice } from "../types";
declare const convertStreamToBuffer: (stream: Readable) => Promise<Buffer>;
declare const getBaseName: (filename: string) => string;
declare const getFileExtension: (filename: string) => string;
declare const getPreferredBucket: (optionsBucket?: string, fileFieldsBucket?: string, bucketChoice?: BucketChoice) => string | undefined;
declare const getFilenameWithSuffix: (listObjects: ListObjectsOutput, baseFilename: string, fileExtension: string) => string;
declare const processMultipartFormData: (req: FastifyRequest, _payload: IncomingMessage, done: (err: Error | null, body?: unknown) => void) => void;
export { convertStreamToBuffer, getBaseName, getFileExtension, getPreferredBucket, getFilenameWithSuffix, processMultipartFormData, };
//# sourceMappingURL=index.d.ts.map