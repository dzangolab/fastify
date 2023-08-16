import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

/* eslint-disable brace-style */
class FileSqlFactory<
    File extends QueryResultRow,
    FileCreateInput extends QueryResultRow,
    FileUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<File, FileCreateInput, FileUpdateInput>
  implements SqlFactory<File, FileCreateInput, FileUpdateInput> {}

export default FileSqlFactory;
