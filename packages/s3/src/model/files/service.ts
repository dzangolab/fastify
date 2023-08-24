import { BaseService } from "@dzangolab/fastify-slonik";
import { v4 as uuidv4 } from "uuid";

import FileSqlFactory from "./sqlFactory";
import { TABLE_FILES } from "../../constants";
import { FilePayload } from "../../types/";
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
  protected s3Client = new S3Client(this.config);
  protected _path: string = undefined as unknown as string;
  protected _filename: string = undefined as unknown as string;
  protected _fileExtension: string = undefined as unknown as string;

  get table() {
    return this.config.s3?.table?.name || TABLE_FILES;
  }

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new FileSqlFactory<
        File,
        FileCreateInput,
        FileUpdateInput
      >(this);
    }

    return this._factory as FileSqlFactory<
      File,
      FileCreateInput,
      FileUpdateInput
    >;
  }

  get bucket() {
    return this.s3Client.bucket;
  }

  set bucket(bucket: string) {
    this.s3Client.bucket = bucket;
  }

  get filename() {
    return this._filename || `${uuidv4()}${this.fileExtension}`;
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

  upload = async (data: FilePayload) => {
    const { fileContent, metadata } = data;
    const { filename, mimetype, data: fileData } = fileContent;

    const fileExtension = filename.slice(filename.lastIndexOf("."));
    this.fileExtension = fileExtension;

    const key = this.key;

    const uploadResult = await this.s3Client.upload(fileData, key, mimetype);

    if (!uploadResult) {
      return;
    }

    const fileInput = {
      ...(metadata && { ...metadata }),
      originalFileName: filename,
      key: key,
    } as unknown as FileCreateInput;

    const result = this.create(fileInput);

    return result;
  };

  getById = async (id: number, signedUrlExpireInSecond: number) => {
    const file = await this.findById(id);

    if (!file) {
      return;
    }

    const signedUrl = await this.s3Client.generatePresignedUrl(
      file.key as string,
      signedUrlExpireInSecond
    );

    return {
      ...file,
      url: signedUrl,
    };
  };
}

export default FileService;
