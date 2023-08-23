import { BaseService } from "@dzangolab/fastify-slonik";

import FileSqlFactory from "./sqlFactory";
import { TABLE_FILES } from "../../constants";
import { FileUploadType } from "../../types/";
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
  s3Client = new S3Client(this.config);

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

  upload = async (data: FileUploadType) => {
    const { uploadedFile, fileMetadata } = data.files;
    const { filename, mimetype, data: fileData } = uploadedFile;
    const { path = "", filename: optionFilename = filename } =
      data.configs || {};

    this.s3Client.path = path;
    this.s3Client.filename = optionFilename;

    const managedUpload = await this.s3Client.upload(fileData, mimetype);

    if (managedUpload) {
      const newFile = {
        ...(fileMetadata && {
          ...fileMetadata,
        }),
        originalFileName: filename,
        key: this.s3Client.key,
      } as unknown as FileCreateInput;

      const createdFile = this.create(newFile);

      return createdFile;
    }

    return;
  };
}

export default FileService;
