import { BaseService } from "@dzangolab/fastify-slonik";

import FileSqlFactory from "./sqlFactory";
import { TABLE_FILES } from "../../constants";
import { FileUploadType } from "../../types";
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

  upload = async (data: FileUploadType) => {
    const { filename, mimetype, data: fileData } = data.multipartFile;

    this.s3Client.path = data.options?.path || "";
    this.s3Client.filename = data.options?.filename || filename;
    this.s3Client.bucket = data.options?.bucket || "";

    const uploaded = await this.s3Client.upload(fileData, mimetype);

    if (uploaded) {
      const file: any = {
        originalFileName: filename,
        bucket: this.s3Client.bucket,
        key: this.s3Client.key,
      };
      const result = this.create(file);

      return result;
    }

    return;
  };
}

export default FileService;
