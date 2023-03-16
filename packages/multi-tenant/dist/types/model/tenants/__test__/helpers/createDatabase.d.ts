declare const helper: (result?: {}[]) => {
    connect: <T>(connectionRoutine: import("slonik/dist/src/types").ConnectionRoutine<T>) => Promise<T>;
    pool: import("slonik").DatabasePool;
    query: import("slonik/dist/src/types").QueryFunction;
};
export default helper;
//# sourceMappingURL=createDatabase.d.ts.map