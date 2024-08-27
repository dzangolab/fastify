declare const helper: (result?: {}[]) => {
    connect: <T>(connectionRoutine: import("slonik").ConnectionRoutine<T>) => Promise<T>;
    pool: import("slonik").DatabasePool;
    query: import("slonik").QueryFunction;
};
export default helper;
//# sourceMappingURL=createDatabase.d.ts.map