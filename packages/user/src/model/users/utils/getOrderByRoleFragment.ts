import { sql } from "slonik";

import type { SortInput } from "@dzangolab/fastify-slonik";

const getSortedRoleFragment = (sort?: SortInput[]) => {
  let direction = sql.fragment`ASC`;

  if (sort && sort.length > 0) {
    for (const data of sort) {
      if (data.key === "roles" && data.direction != "ASC") {
        direction = sql.fragment`DESC`;
      }
    }
  }

  return sql.fragment`ORDER BY ${sql.identifier(["ur", "role"])} ${direction}`;
};

export default getSortedRoleFragment;
