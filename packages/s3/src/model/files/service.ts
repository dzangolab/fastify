import { BaseService, formatDate } from "@dzangolab/fastify-slonik";
import { v4 as uuidv4 } from "uuid";

import { ADD_SUFFIX, ERROR, TABLE_FILES } from "../../constants";
import { PresignedUrlOptions, FilePayload } from "../../types/";
import {
  getPreferredBucket,
  getFileExtension,
  getFilenameWithSuffix,
  getBaseName,
  getFileDataAsBuffer,
} from "../../utils";
import S3Client from "../../utils/s3Client";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class FileService<
    File extends QueryResultRow,
    FileCreateInput extends QueryResultRow,
    FileUpdateInput extends QueryResultRow
  >
  extends BaseService<File, FileCreateInput, FileUpdateInput>
  // eslint-disable-next-line prettier/prettier
  implements Service<File, FileCreateInput, FileUpdateInput> {
  protected _filename: string = undefined as unknown as string;
  protected _fileExtension: string = undefined as unknown as string;
  protected _path: string = undefined as unknown as string;
  protected _s3Client: S3Client | undefined;

  get table() {
    return this.config.s3?.table?.name || TABLE_FILES;
  }

  get filename() {
    if (this._filename && !this._filename.endsWith(this.fileExtension)) {
      return `${this._filename}.${this.fileExtension}`;
    }

    return this._filename || `${uuidv4()}.${this.fileExtension}`;
  }

  set filename(filename: string) {
    this._filename = filename;
  }

  get fileExtension() {
    return this._fileExtension;
  }

  set fileExtension(fileExtension: string) {
    this._fileExtension = fileExtension;
  }

  get path() {
    return this._path;
  }

  set path(path: string) {
    this._path = path;
  }

  get key() {
    let formattedPath = "";

    if (this.path) {
      formattedPath = this.path.endsWith("/") ? this.path : this.path + "/";
    }

    return `${formattedPath}${this.filename}`;
  }

  get s3Client() {
    return this._s3Client ?? (this._s3Client = new S3Client(this.config));
  }

  deleteFile = async (fileId: number, options?: { bucket?: string }) => {
    const file = await this.findById(fileId);

    if (!file) {
      throw new Error(`File with ID ${fileId} not found.`);
    }

    this.s3Client.bucket = options?.bucket || (file.bucket as string);

    const result = await this.delete(fileId);

    if (result) {
      await this.s3Client.delete(file.key as string);
    }

    return result;
  };

  download = async (id: number, options?: { bucket?: string }) => {
    const file = await this.findById(id);

    if (!file) {
      throw new Error(`File with ID ${id} not found.`);
    }

    this.s3Client.bucket = options?.bucket || (file.bucket as string);

    const s3Object = await this.s3Client.get(file.key as string);

    return {
      ...file,
      mimeType: s3Object?.ContentType,
      fileStream: s3Object.Body,
    };
  };

  presignedUrl = async (id: number, options: PresignedUrlOptions) => {
    const file = await this.findById(id);

    if (!file) {
      throw new Error(`File with ID ${id} not found.`);
    }

    this.s3Client.bucket = options.bucket || (file.bucket as string);

    const signedUrl = await this.s3Client.generatePresignedUrl(
      file.key as string,
      file.originalFileName as string,
      options.signedUrlExpiresInSecond
    );

    return {
      ...file,
      url: signedUrl,
    };
  };

  upload = async (data: FilePayload) => {
    const { fileContent, fileFields } = data.file;
    const { filename, mimetype } = fileContent;
    const {
      path = "",
      bucket = "",
      bucketChoice,
      filenameResolutionStrategy,
    } = data.options || {};

    const fileExtension = getFileExtension(filename);
    this.fileExtension = fileExtension;

    this.path = path;
    this.s3Client.bucket =
      getPreferredBucket(bucket, fileFields?.bucket, bucketChoice) || "";

    let key = this.key;

    // check file exist
    const headObjectResponse = await this.s3Client.isFileExists(key);
    const resolutionStrategy =
      filenameResolutionStrategy || this.config.s3.filenameResolutionStrategy;

    if (headObjectResponse) {
      switch (resolutionStrategy) {
        case ERROR: {
          throw new Error("File already exists in S3.");
        }
        case ADD_SUFFIX: {
          const baseFilename = getBaseName(this.filename);
          const listObjects = await this.s3Client.getObjects(baseFilename);

          const filenameWithSuffix = getFilenameWithSuffix(
            listObjects,
            baseFilename,
            this.fileExtension
          );

          this.filename = filenameWithSuffix;
          key = this.key;
          break;
        }
      }
    }

    const fileData = await getFileDataAsBuffer(fileContent.data);

    const uploadResult = await this.s3Client.upload(fileData, key, mimetype);

    if (!uploadResult) {
      return;
    }

    const fileInput = {
      ...(fileFields && { ...fileFields }),
      ...(fileFields?.uploadedAt && {
        uploadedAt: formatDate(new Date(fileFields.uploadedAt)),
      }),
      ...(fileFields?.lastDownloadedAt && {
        lastDownloadedAt: formatDate(new Date(fileFields.lastDownloadedAt)),
      }),
      originalFileName: filename,
      key: key,
    } as unknown as FileCreateInput;

    const result = this.create(fileInput);

    return result;
  };
}

export default FileService;
