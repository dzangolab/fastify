import { BaseService } from "@dzangolab/fastify-slonik";

import FileSqlFactory from "./sqlFactory";
import { TABLE_FILES } from "../../constants";

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
}

export default FileService;
