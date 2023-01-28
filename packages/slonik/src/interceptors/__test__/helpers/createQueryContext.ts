import type { QueryContext } from "slonik";

const helper = (): QueryContext => {
  return {
    connectionId: "1",
    log: {
      getContext: () => {
        return {
          connectionId: "1",
          poolId: "1",
        };
      },
    },
    poolId: "1",
    sandbox: {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};

export default helper;
